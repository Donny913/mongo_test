const http = require('http');
const static = require('./server/static-server');
const api = require('./server/api');

const app = (req, res) => {
  const url = req.url;

  if (url.indexOf('public') !== -1) {
    static(url, res);
  } else if (url.indexOf('api') !== -1) {
    api(req, res);
  } else {
    static('index.html', res);
  }
};

http.createServer(app).listen(1337, () => console.log('server is on 1337'));
