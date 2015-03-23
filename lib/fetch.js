/*jshint regexp:false */

module.exports = function(opts, cb) {
  'use strict';

  var format = require('util').format
    , fs = require('fs')
    , path = require('path')
    , request = require('request')
    , async = require('async')
    , mkdirp = require('mkdirp')
    , _after = require('lodash.after');

  var apiKey = opts.trelloApiKey
    , authToken = opts.trelloToken
    , boardId = opts.trelloBoardUrl
      .replace(/.*\/b\//, '')
      .replace(/\/.*$/, '')
    , pagesListName = opts.trelloBoardPagesList
    , blogListName = opts.trelloBoardBlogList;

  var tmpDir = '.stello/trello'
    , bkTmpDir = '.stello/trello-bk'; // Eventually, stash existing tmp dir so we can back out of changes if things go wrong

  var done = _after(2, cb || function() {});

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

  // var getBoardListIdByName = function(boardId, listName) {
  //   return function(cb) {
  //     var uri = format('https://api.trello.com/1/boards/%s/lists?key=%s&token=%s', boardId, apiKey, authToken);
  //     request(uri, function(error, resp, body) {
  //       if(error) { return cb(error); }
  //       var lists, ix;
  //       try {
  //         lists = JSON.parse(body);
  //       } catch(error) {
  //         return cb(error);
  //       }
  //       for(ix = lists.length; ix--;) {
  //         if(lists[ix].name === listName) {
  //           return cb(null, lists[ix].id);
  //         }
  //       }
  //       cb(new Error(format('Could not find a list %s in board %s.', listName, boardId)));
  //     });
  //   };
  // };

  var createListFolders = function(lists, cb) {
    var _cb = _after(lists.length, function() {
      cb(null, lists);
    });

    lists.each(function(list) {
      var dir = path.join(tmpDir, list.id);
      mkdirp(dir, function(err) {
        if(err) { return cb(err); }
        _cb();
      });
    });
  };

  var getListCards = function(lists, cb) {
    var allCards = [];
    async.each(
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
            Array.prototype.push.apply(allCards, cards);
            return cb(error);
          }
          return cb(null, cards);
          }, function(err) {
            if(err) { return cb(err); }
            cb(null, lists);
          }
        );
      },
      function(err) {
        if(err) { return cb(err); }
        return(null, allCards);
      }
    );
  };

  var saveCards = function(cards, cb) {
    async.each(
      cards,
      function(card, cb) {
        // Create frontmatter from card json
        // Save to tmpdir under list directory
      },
      function(err) {
        if(err) { return cb(err); }
        cb(null, cards);
      }
    );
  };

  // var saveToTmpDirAs = function(filename) {
  //   return function(data, cb) {
  //     var filepath = path.join(tmpDir, filename);
  //     fs.writeFile(filepath, JSON.stringify(data), function(error) {
  //       return error ? cb(error) : cb();
  //     });
  //   };
  // };

  mkdirp(tmpDir, function(error) {
    if(error) { return cb(error); }

    async.waterfall([
      getBoardLists(boardId),
      createListFolders,
      getListCards,
      saveCards
    ], done);

  });
};

