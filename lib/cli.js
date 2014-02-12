
module.exports = function(program) {
  'use strict';

  var action = program.args[0]
    , stello = require('./stello')
    , nconf = require('nconf')
    , confDefaults = require('../conf/cli-defaults')();

  // Supports all-caps underscored versions of keys prefixed with 'STELLO_'
  Object.keys(process.env).forEach(function(v) {
    if(/^STELLO_([_\w\d]+)/.exec(v)) {
      var stelloV = RegExp.$1.split('_').map(function(s, ix) {
        if(0 === ix) { return s.toLowerCase(); }
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      }).join('');
      confDefaults[stelloV] = process.env[v];
    }
  });

  nconf.argv()
    .file(process.cwd() + '/.stellorc')
    .defaults(confDefaults);

  var conf = function() {
    var hash = {};
    Object.keys(confDefaults).forEach(function(k) {
      hash[k] = program.hasOwnProperty(k) ? program[k] : nconf.get(k);
    });
    return hash;
  };

  var cb = function(error) {
    if(error) { throw error; }
  };

  if('init' === action) {
    stello.init(conf(), cb);
  } else if('fetch' === action) {
    stello.fetch(conf(), cb);
  } else if('build' === action) {
    stello.build(conf(), cb);
  } else if('server' === action) {
    stello.server(conf(), cb);
  } else if('test' === action) {
    console.log('Testing cli... use `npm test` to run full test suite.');
    require('./cli-test')();
  } else if('hello' === action) {
    console.log('How you doing ;)');
  } else {
    console.log('What am I supposed to do with ' + action + '?');
  }
};
