
var fs = require('fs');

/**
 * (over)Write a stellorc config file
 */
module.exports.write = function(data, cb) {
  var rcDataStr = JSON.stringify(data, null, '  ')
  fs.writeFile('.stellorc', rcDataStr, function(err) {
    cb(err, data);
  });
};

/**
 * Get the contents of the stellorc config file if it exists
 */
module.exports.read = function(cb) {
  var utf8 = {encoding: 'utf8'};
  fs.readFile('.stellorc', utf8, function(err, rcDataStr) {
    if(err) { return cb(err); }
    var data;
    try {
      data = JSON.parse(rcDataStr);
    } catch(decodeErr) {
      err = new Error('Unable to read stello config, do you have a well formatted .stellorc file?');
    }
    return cb(err, data);
  });
};
