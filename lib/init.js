
'use strict';

var sh = require('shelljs')
  , _find = require('lodash.find')
  , prompt = require('inquirer').prompt
  , stellorc = require('./stellorc')
  , tpl = require('stello-tpl-starter')
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

    var pkg = require('../package.json')
      , tplDir = tpl.getTemplateDirectoryPath();

    result.$$stello = {
      version: pkg.version,
      intialized: Date.now()
    };

    // Copy template into working directory... should use async api
    sh.rm('-rf', 'src');
    sh.cp('-r', tplDir + '/*', 'src');

    stellorc.write(result, cb);
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
