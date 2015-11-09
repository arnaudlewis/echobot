var http = require('http');

exports.createServer = function createServer() {
  var server = http.createServer(function (req, res) {
    server.emit(req.url, req, res);
  });

  return server;
};
