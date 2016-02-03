
'use strict';

module.exports = function(allCards, allLists) {
  return function(options) {
    var ret = '';

    (allLists || []).forEach(function(l) {
      ret += options.fn(l);
    });

    return ret;
  };
};
