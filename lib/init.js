
module.exports = function(opts, cb) {
  'use strict';

  var fs = require('fs')
    , prompt = require('inquirer').prompt
    , defaults = require('../conf/cli-defaults')();

  var _find = require('lodash.find');

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
  },{
    name: 'trelloBoardPagesList',
    message: 'Pages list name',
    default: defaults.trelloBoardPagesList
  },{
    name: 'trelloBoardBlogList',
    message: 'Blog list name',
    default: defaults.trelloBoardBlogList
  },{
    name: 'installTemplate',
    type: 'confirm',
    message: 'Install a template',
    default: defaults.installTemplate
  },{
    name: 'templateToInstall',
    message: 'Template to install',
    default: defaults.installTemplate
  },{
    name: 'gitIgnoreStellorc',
    type: 'confirm',
    message: 'Add .stellorc to gitignore?',
    default: defaults.gitIgnoreStellorc
  }];

  var finish = function(result) {
    if(opts.dryRun) {
      console.log(JSON.stringify(result, null, ' '));
      process.exit(0);
    }

    var pkg = require('../package.json');

    result.$$stello = {
      version: pkg.version,
      initializedOn: Date.now()
    }

    var rcData = JSON.stringify(result, null, '  ')
      , writeErr = require('fs').writeFileSync('.stellorc', rcData);
    (cb || function(){})(writeErr, result);

    if(result.gitIgnoreStellorc) {
      require('./git-ignore-stellorc')(process.cwd(), function(err) {
        if(err) { throw err; }
      });
    }
  };

  // If we're told to be quiet don't prompt the user for input
  if(opts.silent) {
    return finish(opts);
  }

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
