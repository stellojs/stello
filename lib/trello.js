
var format = require('util').format
  , request = require('request')
  , async = require('async')

/**
 * Fetches trello lists for the board with the given id
 *
 * Callback will be passed an error if there is one and the array of lists.
 *
 * @param String boardId ID of the board to get lists for
 * @param Function cb The callback
 * @return Function The list getter function
 */
var getBoardLists = function(boardId, cb) {
  var uri = format('https://api.trello.com/1/boards/%s/lists?key=%s&token=%s', boardId, apiKey, authToken);
  request(uri, function(error, resp, body) {
    if(error) { return cb(error); }
    var lists;
    try {
      lists = JSON.parse(body);
    } catch(error) {
      return cb(error);
    }
    return cb(null, lists);
  });
};

/**
 * Fetches trello cards for the given lists
 *
 * Note that cards are not separated by list.
 * 
 * @param Array lists
 * @param Function cb
 */
var getListsCards = function(lists, cb) {
  async.map(
    lists,
    function(list, cb) {
      var listId = list.id
        , uri = format('https://api.trello.com/1/lists/%s/cards?key=%s&token=%s', listId, apiKey, authToken);
      request(uri, function(error, resp, body) {
        if(error) { return cb(error); }
        var cards;
        try {
          cards = JSON.parse(body);
        } catch(error) {
          return cb(error);
        }
        return cb(null, cards);
      });
    },
    function(err, cardsAndCards) {
      if(err) { return cb(err); }
      var allCards = [];
      cardsAndCards.forEach(function(cards) {
        Array.prototype.push.apply(allCards, cards);
      });
      cb(null, allCards);
    }
  );
};

exports.getBoardLists = getBoardLists;
exports.getListCards = getListCards;
