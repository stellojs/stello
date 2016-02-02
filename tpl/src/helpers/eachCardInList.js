
'use strict';

module.exports = function(allCards, allLists) {
  var listIdNameMap = {};

  (allLists || []).forEach(function(l) {
    listIdNameMap[l.id] = l.name;
  });

  return function(listId, options) {
    var ret = '';

    (allCards || [])
      .filter(function(c) {
        return listId === c.idList || listId === listIdNameMap[c.idList];
      })
      .forEach(function(c) {
        ret += options.fn(c);
      });

    return ret;
  };
};

