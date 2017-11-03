const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const sendFile = (filePath, res) => {
  fs
    .createReadStream(filePath)
    .on('response', () => {
      res.setHeader('Content-Type', mime.contentType(filePath));
    })
    .pipe(res)
    .on('end', () => {
      console.log('response sended');
      res.end();
    })
    .on('error', () => {
      console.log('sending response error');
      console.log(err);
    });
};

const static = (url, res) => {
  const filePath = path.join(__dirname, '../', url);
  fs.access(filePath, err => {
    if (err) {
      console.log('no such file');
      console.error(err);
      res.end();
      return;
    }
    sendFile(filePath, res);
  });
};

module.exports = {
  static,
  sendFile
};
