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
    var _cb = _after(lists.length + 1, function() {
      cb(null, lists);
    });

    lists.forEach(function(list) {
      var dir = path.join(outDir, listDirName(list));
      mkdirp(dir, function(err) {
        if(err) { return cb(err); }
        _cb();
      });
    });

    fs.writeFile(path.join(outDir, 'lists.json'), JSON.stringify(lists, null, '  '), function(err) {
      if(err) { return cb(err); }
      _cb();
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

  /**
   * @todo save existing data dir in a safe spot if it exists, restore it of
   * something goes wrong
   */
  if(fs.existsSync(outDir)) {
    require('shelljs').rm('-rf', outDir);
  }

  mkdirp(outDir, function(error) {
    if(error) { return cb(error); }

    async.waterfall([
      getBoardLists(boardId),
      createListFolders,
      getListCards,
      saveCards
    ], done);

  });
};

