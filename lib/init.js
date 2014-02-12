
module.exports = function(opts, cb) {
  'use strict';

  var prompt = require('prompt')
    , defaults = require('../conf/cli-defaults')();

  prompt.message = '>> '.green;
  prompt.delimiter = '';

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
    name: 'src',
    message: 'Source files folder path',
    default: defaults.src
  },{
    name: 'dest',
    message: 'Ouput folder path',
    default: defaults.dest
  },{
    name: 'tmpDir',
    message: 'Tmp folder name',
    default: defaults.tmpDir
  }];

  // opts might just have defaults... only skip prompts for items that still
  // have a default value
  Object.keys(opts).forEach(function(k) {
    if(opts[k] === defaults[k]) {
      delete opts[k];
    }
  });

  prompt.override = opts;

  prompt.start();

  prompt.get(props, function(err, result) {
    if(err) {
      if(cb) { return cb(err); }
      throw err;
    }

    // Short circuit for testing
    if(opts.dryRun) {
      console.log(JSON.stringify(result, null, ' '));
      process.exit(0);
    }

    var rcData = JSON.stringify(result, null, '  ')
      , writeErr = require('fs').writeFileSync('.stellorc', rcData);
    (cb || function(){})(writeErr, result);
  });
};
