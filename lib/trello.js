
var format = require('util').format
  , request = require('request')
  , async = require('async')

/**
 * The Trello class
 */
var Trello = module.exports = function(apiKey, authToken) {
  this.apiKey = apiKey;
  this.authToken = authToken;
}

/**
 * Get a board id from its url
 *
 * If the passed string is already an ID it will be returned
 *
 * @param {String} boardUrl The board url
 * @return {String} The board id
 */
var getBoardIdFromUrl = function(boardUrl) {
  var urlParts = boardUrl.split('/'), part;

  if(1 === urlParts.length) {
    // Already an ID?
    return boardUrl;
  }

  while(urlParts.length) {
    part = urlParts.shift();
    if('b' === part && urlParts.length) {
      return urlParts[0];
    }
  }

  var msg = format('Could not get board id from url: "%s"', boardUrl);
  throw new Error(msg);
};

Trello.getBoardIdFromUrl = getBoardIdFromUrl;
Trello.prototype.getBoardIdFromUrl = getBoardIdFromUrl;

/**
 * Fetches trello lists for the board with the given id
 *
 * Callback will be passed an error if there is one and the array of lists.
 *
 * @param {String} boardId ID of the board to get lists for
 * @param {Function} cb The callback
 */
Trello.prototype.getBoardLists = function(boardId, cb) {
  boardId = getBoardIdFromUrl(boardId);
  var apiKey = this.apiKey
    , authToken = this.authToken
    , uri = format('https://api.trello.com/1/boards/%s/lists?key=%s&token=%s', boardId, apiKey, authToken);
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
 * Get a list of cards for a given board
 *
 * @param {String} boardId The id or url for a given board
 * @param {Function} cb The callback
 */
Trello.prototype.getBoardCards = function(boardId, cb) {
  boardId = getBoardIdFromUrl(boardId);
  var apiKey = this.apiKey
    , authToken = this.authToken
    , uri = format('https://api.trello.com/1/boards/%s/cards?key=%s&token=%s', boardId, apiKey, authToken);
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
};

/**
 * Fetches trello cards for the given lists
 *
 * Note that cards are not separated by list.
 * 
 * @param {Array} lists
 * @param {Function} cb
 */
Trello.prototype.getListsCards = function(lists, cb) {
  var apiKey = this.apiKey
    , authToken = this.authToken;
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

