var test = require('tape');
var url = require('url');
var path = require('path');
var curli = require(path.join(__dirname, '..'));
var testServer = require(path.join(__dirname, 'server.js'));

test('Request method', function(t) {
  var server = testServer.createServer();

  t.test('Ensure HEAD request is made', function(t) {
    server.listen(0, function() {
      var port = server.address().port;
      var host = '//localhost:' + port;
      var href = 'http:' + host + '/';

      server.on('/', function(req, res) {
        t.equal(req.method, 'HEAD', 'Request method should be "HEAD"');
        res.writeHead(200);
        res.end();
      });

      curli(href, function(err, headers) {
        t.ok(headers, 'Headers sent');
        t.error(err, 'Shouldn\'t error');
        server.close();
        t.end();
      });
    });
  });

  t.test('Cannot override default request method', function(t) {
    server.listen(0, function() {
      var port = server.address().port;
      var host = '//localhost:' + port;
      var href = 'http:' + host + '/';
      var options = url.parse(href);
      options.method = 'GET';

      server.on('/', function(req, res) {
        t.equal(req.method, 'HEAD', 'Request method should be "HEAD"');
        t.notEqual(req.method, 'GET', 'Request method should not be "GET"');
        res.writeHead(200);
        res.end();
      });

      curli(options, function(err, headers) {
        t.ok(headers, 'Headers sent');
        t.error(err, 'Shouldn\'t error');
        server.close();
        t.end();
      });
    });
  });
});

test('Standard http requests', function(t) {
  var server = testServer.createServer();

  server.listen(0, function() {
    var port = server.address().port;
    var host = '//localhost:' + port;
    var href = 'http:' + host + '/';
    var options = url.parse(href);
    var testHeaders = {
      'content-type': 'application/json; charset=UTF-8'
    };

    server.on('/', function(req, res) {
      res.writeHead(200, testHeaders);
      res.end();
    });

    t.test('String as first argument', function(t) {
      curli(href, function(err, headers) {
        t.error(err, 'Shouldn\'t error');
        t.ok(headers, 'Headers sent');
        t.equal(headers['content-type'], testHeaders['content-type'], '\'Content-Type\' header set');
        t.end();
      });
    });

    t.test('Object as first argument', function(t) {
      curli(options, function(err, headers) {
        t.error(err, 'Shouldn\'t error');
        t.ok(headers, 'Headers sent');
        t.equal(headers['content-type'], testHeaders['content-type'], '\'Content-Type\' header set');
        t.deepEqual(options, url.parse(href), 'Don\'t mutate input object');
        server.close();
        t.end();
      });
    });
  });
});
