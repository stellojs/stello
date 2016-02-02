
'use strict';

module.exports = function(options) {
  var ret = '';

  (this.allLists || []).forEach(function(l) {
    ret += options.fn(l);
  });

  return ret;
};
