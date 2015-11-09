var test = require('tape');
var path = require('path');
var url = require('url');
var curli = require(path.join(__dirname, '..'));
var server = require(path.join(__dirname, './server.js')).createServer();

server.listen(0, function() {
  var port = server.address().port;
  var host = '//localhost:' + port;
  var href = 'http:' + host + '/';
  var options = url.parse(href);

  options.headers = {
    'Cache-Control': 'no-cache'
  };

  test('Attatch headers to request object', function(t) {
    server.on('/', function(req, res) {
      t.equal(req.headers['cache-control'], 'no-cache', 'Custom header set');
      res.writeHead(200);
      res.end();
    });

    curli(options, function(err, headers) {
      t.ok(headers, 'Headers sent');
      t.error(err, 'Shouldn\'t error');
      t.end();
    });
  });

  test('Custom header as second argument', function(t) {
    server.on('/', function(req, res) {
      t.equal(req.headers['cache-control'], 'no-cache', 'Custom header set');
      res.writeHead(200);
      res.end();
    });

    curli(href, options.headers, function(err, headers) {
      t.ok(headers, 'Headers sent');
      t.error(err, 'Shouldn\'t error');
      server.close();
      t.end();
    });
  });
});
