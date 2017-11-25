const querystring = require('querystring');
const db = require('../db/db');
const static = require('./static-server.js');

const getUrlQuerystrinfDecodedData = req => {
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

const insertData = async (req, res) => {
  try {
    const queryData = await getUrlQuerystrinfDecodedData(req);
    await db.insert(queryData);
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
      res.end();
    });
};

const getData = (req, res) => {
  let reqData = '';
  req
    .on('data', data => {
      reqData += data;
    })
    .on('end', () => {
      reqData = JSON.parse(reqData);
      db.get(reqData);
      res.end(JSON.stringify({ hello: 'world' }));
    });
};

const removeCollection = (req, res) => {
  getUrlQuerystrinfDecodedData(req).then(collectionId => {
    db.removeCollection(collectionId);
    res.end();
  });
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
    removeCollection(req, res);
  }
};

module.exports = api;
