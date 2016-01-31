
'use strict';

module.exports = function(options) {
  var ret = '';

  (this.allCards || []).forEach(function(c) {
    ret += options.fn(c);
  });

  return ret;
};
