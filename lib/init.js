
module.exports = function(opts, cb) {
  'use strict';

  var prompt = require('prompt');

  prompt.start();

  prompt.get('apiKey', function(err, result) {
    console.log(result);
  });
};
