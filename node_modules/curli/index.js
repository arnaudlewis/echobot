var url = require('url');
var http = require('http');
var https = require('https');
var buildUAString = require('./lib/util').buildUAString;

function curli(uri, opts, callback) {
  var options = {};
  var request;
  var key;

  if (typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }
  if (typeof opts === 'object') {
    options.headers = opts;
  }
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }
  if (typeof uri === 'string') {
    opts = url.parse(uri, true);
    uri = undefined;
  }

  if (!opts.protocol)
    return callback(new Error('protocol not specified'));

  for (key in opts) {
    options[key] = opts[key];
  }

  if (!opts.headers && !options.headers)
    options.headers = {};

  for (key in opts.headers) {
    if (/user-agent/i.test(key)) {
      options.headers['user-agent'] = opts.headers[key];
      continue;
    }
    options.headers[key] = opts.headers[key];
  }

  if (!options.headers['user-agent'])
    options.headers['user-agent'] = buildUAString();

  options.method = 'HEAD';

  request = options.protocol === 'https:' ? https.request : http.request;

  var req = request(options, function response(res) {
    res.on('end', function() {
      return callback(null, res.headers);
    });
    res.resume();
  });
  req.on('error', function error(err) {
    return callback(err);
  });
  req.end();
}

module.exports = curli;

