# curli

Simple HTTP HEAD requests in node.js, just like you would with `curl -I`.

[![build status](https://secure.travis-ci.org/joshgillies/node-curli.svg)](http://travis-ci.org/joshgillies/node-curli)

[![NPM](https://nodei.co/npm/curli.png?downloads=true&stars=true)](https://nodei.co/npm/curli/)

# Example

```js
var curli = require('curli');

curli('http://www.google.com', { 'Cache-Control': 'no-cache' }, function(err, headers) {
  if (err) return console.error(err);
  console.log(headers);
});
```

# API

# curli(uri, opts={}, cb)

The first argument `uri` can either be a string or request style object. Internally if passed a string curli will use `url.parse()` to create an object that gets passed to `http.request(opts)`.

You may also wish to specify custom headers to be sent with the request. These can be passed via the optional `opts` argument. This is optional as it's also possible to pass headers via `uri.headers` where `uri` is a `http.request(opts)` style object.

The third argument is a standard Node style callback `cb(err, headers)` and will be called once a response is recieved. It returns `err` as an error object or `null`, and `headers` is a standard JavaScript object identical to `res.headers` object.

# Install

`npm install curli`

# License

MIT
