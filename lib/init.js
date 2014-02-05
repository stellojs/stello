
module.exports = function(opts, cb) {
  'use strict';

  var prompt = require('prompt')
    , defaults = require('../conf/cli-defaults')();

  prompt.message = '>> '.green;
  prompt.delimiter = '';

  var props = [{
    name: 'trelloApiKey',
    message: 'Trello API key (' + defaults.trelloApiKey + ')'
  },{
    name: 'trelloToken',
    message: 'Trello auth token (' + defaults.trelloToken + ')'
  },{
    name: 'trelloBoardUrl',
    message: 'Trello board URL (' + defaults.trelloBoardUrl + ')'
  },{
    name: 'trelloBoardPagesList',
    message: 'Pages list name (' + defaults.trelloBoardPagesList + ')'
  },{
    name: 'trelloBoardBlogList',
    message: 'Blog list name (' + defaults.trelloBoardBlogList + ')'
  },{
    name: 'src',
    message: 'Source files folder path (' + defaults.src + ')'
  },{
    name: 'dest',
    message: 'Ouput folder path (' + defaults.dest + ')'
  },{
    name: 'tmpDir',
    message: 'Tmp folder name (' + defaults.tmpDir + ')'
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

    var rcData = JSON.stringify(result, null, '  ')
      , writeErr = require('fs').writeFileSync('.stellorc', rcData);
    (cb || function(){})(writeErr, result);
  });
};
