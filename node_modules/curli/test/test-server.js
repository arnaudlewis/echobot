var http = require('http');

module.exports = function testServer() {
  var server = http.createServer(function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'User-Agent': req.headers['user-agent']
    });
    res.end('okay');
  });

  return server;
};

