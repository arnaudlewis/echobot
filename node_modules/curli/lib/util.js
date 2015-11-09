exports.buildUAString = function buildUAString() {
  var conf = require('../package.json');
  return conf.name + ' / ' + conf.version;
};
