
// CB gets an error if there is one
module.exports = function(dir, cb) {
  'use strict';

  var path = require('path')
    , fs = require('fs');

  var ignoreFile = path.join(dir, '.gitignore');

  cb = cb || function() {};

  fs.exists(ignoreFile, function(isThere) {
    if(isThere) {
      fs.readFile(ignoreFile, function(err, data) {
        if(err) { return cb(err); }
        var lines = data.toString().split('\n')
          , isIgnored = false;
        lines.forEach(function(l) {
          if(/^\.stellorc\s*/.test(l)) {
            isIgnored = true; // Already ignored
          }
        });
        if(!isIgnored) {
          lines.unshift('.stellorc');
          fs.writeFile(ignoreFile, lines.join('\n'), cb);
        } else {
          cb();
        }
      });
    } else {
      // No .gitignore file... write one!
      fs.writeFile(ignoreFile, '.stellorc', cb);
    }
  });
};
