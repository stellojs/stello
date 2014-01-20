
module.exports = function(opts, cb) {
  'use strict';

  var prompt = require('prompt');

  prompt.message = '>> '.green;
  prompt.delimiter = '';

  var props = [{
    name: 'trelloApiKey',
    message: 'Trello API key',
    required: true
  },{
    name: 'trelloBoard',
    message: 'Trello board URL',
    required: true
  },{
    name: 'dest',
    message: 'Ouput folder path (dest)'
  },{
    name: 'tmpDir',
    message: 'Tmp folder name (.stello-tmp)'
  }];

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
