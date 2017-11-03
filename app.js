const http = require('http');
const { static, sendFile } = require('./server/static-server');

const app = (req, res) => {
  console.log(req.url);
  if (req.url.indexOf('public') !== -1) {
    static(req.url, res);
  } else if (req.url.indexOf('api') !== -1) {
    console.log('api request');
  } else {
    sendFile('index.html', res);
  }
};

http.createServer(app).listen(1337, () => console.log('server is on 1337'));
