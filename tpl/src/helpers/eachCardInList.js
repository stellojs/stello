
'use strict';

module.exports = function(listId, options) {
  var ret = ''
    , listIdNameMap = {};

  (this.allLists || []).forEach(function(l) {
    listIdNameMap[l.id] = l.name;
  });

  (this.allCards || [])
    .filter(function(c) {
      return listId === c.idList || listId === listIdNameMap[c.idList];
    })
    .forEach(function(c) {
      ret += options.fn(c);
    });

  return ret;
};

