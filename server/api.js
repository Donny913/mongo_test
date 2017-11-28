const querystring = require('querystring');
const db = require('../db/db');
const static = require('./static-server.js');

const decodeUrlQuerystring = req => {
  return new Promise(resolve => {
    let queryData = '';
    req
      .on('data', data => {
        queryData += data;
      })
      .on('end', () => {
        resolve(querystring.parse(queryData));
      });
  });
};

const parseRequest = req => {
  return new Promise((resolve, reject) => {
    let reqData = '';
    req
      .on('data', data => {
        if (data.length > 1e4) {
          reject(new Error('to much love from client'));
        }
        reqData += data;
      })
      .on('end', () => {
        try {
          reqData = JSON.parse(reqData);
          resolve(reqData);
        } catch (error) {
          reject(error);
        }
      });
  });
};

const insertData = async (req, res) => {
  try {
    const queryData = await decodeUrlQuerystring(req);
    await db.insert(queryData);
    static('index.html', res);
  } catch (error) {
    console.log('error in insertData');
    console.error(error);
  }
};

const updateData = (req, res) => {
  let queryData = '';

  req
    .on('data', data => {
      queryData += data;
    })
    .on('end', () => {
      queryData = querystring.parse(queryData);
      const { author, content, title } = queryData;
      db.update({ login: author, content, title });
      static('index.html', res);
    });
};

const getData = async (req, res) => {
  try {
    const clientData = await parseRequest(req);
    const docs = await db.get(clientData);
    res.end(JSON.stringify(docs));
  } catch (error) {
    console.error(error);
  }
};

const removeDocument = async (req, res) => {
  try {
    const queryString = await decodeUrlQuerystring(req);
    await db.removeDocument(queryString);
    static('index.html', res);
  } catch (error) {
    console.log('error in removeDocument');
    console.error(error);
  }
};

const api = (req, res) => {
  const url = req.url;
  if (url.indexOf('insert') !== -1) {
    insertData(req, res);
  } else if (url.indexOf('update') !== -1) {
    updateData(req, res);
  } else if (url.indexOf('get-data') !== -1) {
    getData(req, res);
  } else if (url.indexOf('delete-collection') !== -1) {
    removeDocument(req, res);
  }
};

module.exports = api;
