
'use strict';

var fs = require('fs')
  , _find = require('lodash.find')
  , prompt = require('inquirer').prompt
  , defaults = require('../conf/cli-defaults')();

/**
 * Initialization questions
 */
var props = [{
  name: 'trelloApiKey',
  message: 'Trello API key',
  default: defaults.trelloApiKey
},{
  name: 'trelloToken',
  message: 'Trello auth token',
  default: defaults.trelloToken
},{
  name: 'trelloBoardUrl',
  message: 'Trello board URL',
  default: defaults.trelloBoardUrl
}];

module.exports = function(opts, cb) {
  var finish = function(result) {
    if(opts.dryRun) {
      console.log(JSON.stringify(result, null, ' '));
      process.exit(0);
    }

    var pkg = require('../package.json');

    result.$$stello = {
      version: pkg.version,
      intialized: Date.now()
    };

    var rcData = JSON.stringify(result, null, '  ')
      , writeErr = require('fs').writeFileSync('.stellorc', rcData);
    (cb || function(){})(writeErr, result);
  };

  // opts might just have defaults... only skip prompts for items that still
  // have a default value
  Object.keys(opts).forEach(function(k) {
    if(opts[k] !== defaults[k]) {
      var prop = _find(props, {name: k});
      if(prop) {
        prop.default = opts[k];
      }
    }
  });

  prompt(props, finish);
};
