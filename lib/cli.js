
module.exports = function(program) {
  'use strict';

  var action = program.args[0]
    , nconf = require('nconf');

  nconf.argv()
    .env()
    .file(process.cwd() + '/.stellorc')
    .defaults({
      // ...
    });

  var conf = function() {
    return {
      // Extract options from nconf into a plain old object
    };
  };

  if('init' === action) {
    require('./init')(conf());
  } else if('fetch' === action) {
    require('./fetch')(conf());
  } else if('build' === action) {
    require('./fetch')(conf());
  } else if('server' === action) {
    require('./fetch')(conf());
  } else {
    console.log('What am I supposed to do with ' + action + '?');
  }
};
