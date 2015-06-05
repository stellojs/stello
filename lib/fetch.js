/*jshint regexp:false */

module.exports = function(opts, cb) {
  'use strict';

  var format = require('util').format
    , fs = require('fs')
    , path = require('path')
    , request = require('request')
    , async = require('async')
    , _after = require('lodash.after')
    , sh = require('shelljs');

  var apiKey = opts.trelloApiKey
    , authToken = opts.trelloToken
    , boardId = opts.trelloBoardUrl
      .replace(/.*\/b\//, '')
      .replace(/\/.*$/, '');

  var outDir = 'data';

  var done = _after(2, cb || function() {});

  var listDirName = function(list) {
    return [
      list.name,
      list.id,
    ].join('_');
  };

  var getBoardLists = function(boardId) {
    return function(cb) {
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
  };

  var createListFolders = function(lists, cb) {
    lists.forEach(function(list) {
      var dir = path.join(outDir, listDirName(list));
      sh.mkdir(dir);
    });

    fs.writeFile(path.join(outDir, 'lists.json'), JSON.stringify(lists, null, '  '), function(err) {
      cb(err, lists);
    });
  };

  var getListCards = function(lists, cb) {
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
        cb(null, Array.prototype.push.apply([], cardsAndCards));
      }
    );
  };

  var saveCards = function(cards, cb) {
    async.each(
      cards,
      function(card, cb) {
        // ...
      },
      function(err) {
        if(err) { return cb(err); }
        cb(null, cards);
      }
    );
  };

  /**
   * @todo save existing data dir in a safe spot if it exists, restore it of
   * something goes wrong
   */
  if(fs.existsSync(outDir)) {
    sh.rm('-rf', outDir);
  }

  sh.mkdir('-p', outDir);

  async.waterfall([
    getBoardLists(boardId),
    createListFolders,
    getListCards,
    saveCards
  ], done);
};

