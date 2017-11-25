const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const sendFile = (filePath, res) => {
  res.setHeader('Content-Type', mime.contentType(filePath));
  fs
    .createReadStream(filePath)
    .on('error', () => {
      console.log(`error: ${err}`);
    })
    .pipe(res);
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

module.exports = static;
