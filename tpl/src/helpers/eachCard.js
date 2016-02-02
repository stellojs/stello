
'use strict';


module.exports = function(allCards) {
  return function(options) {
    var ret = '';

    (allCards || []).forEach(function(c) {
      ret += options.fn(c);
    });

    return ret;
  };
};
