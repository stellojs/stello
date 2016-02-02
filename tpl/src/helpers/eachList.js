
'use strict';

module.exports = function(allCards) {
  return function(options) {
    var ret = '';

    (this.allLists || []).forEach(function(l) {
      ret += options.fn(l);
    });

    return ret;
  };
};
