
module.exports = function(program) {
  'use strict';

  var action = program.args[0]
    , stello = require('./stello')
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
    stello.init(conf());
  } else if('fetch' === action) {
    stello.fetch(conf());
  } else if('build' === action) {
    stello.build(conf());
  } else if('server' === action) {
    stello.server(conf());
  } else {
    console.log('What am I supposed to do with ' + action + '?');
  }
};
