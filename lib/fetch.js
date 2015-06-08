/*jshint regexp:false */

module.exports = function(opts, cb) {
  'use strict';

  var format = require('util').format
    , fs = require('fs')
    , path = require('path')
    , request = require('request')
    , async = require('async')
    , _after = require('lodash.after')
    , sh = require('shelljs')
    , chalk = require('chalk');

  var write = function(msg) {
    process.stdout.write(msg);
  };

  var writeln = function(msg) {
    console.log(msg);
  };

  var ok = function() {
    console.log(chalk.green('ok'));
  };

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
      write('Fetching lists for board ' + boardId + '... ');
      var uri = format('https://api.trello.com/1/boards/%s/lists?key=%s&token=%s', boardId, apiKey, authToken);
      request(uri, function(error, resp, body) {
        if(error) { return cb(error); }
        var lists;
        try {
          lists = JSON.parse(body);
        } catch(error) {
          return cb(error);
        }
        ok();
        return cb(null, lists);
      });
    };
  };

  // A temp map of list id => directory for cards
  var listDirMap = {};

  var createListFolders = function(lists, cb) {
    writeln('Creating list folders... ');
    lists.forEach(function(list) {
      write(' - Creating folder for list ' + list.name + '... ');
      var dir = path.join(outDir, listDirName(list));
      listDirMap[list.id] = dir;
      sh.mkdir(dir);
      ok();
    });
    cb(null, lists);
  };

  var getListCards = function(lists, cb) {
    write('Fetching cards... ');
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
        ok();
        cb(null, allCards);
      }
    );
  };

  var saveCards = function(cards, cb) {
    write('Saving cards (' + cards.length + ')... ');
    async.each(
      cards,
      function(card, cb) {
        var listDir = listDirMap[card.idList];
        if(listDir) {
          var cardPath = path.join(listDir, card.pos + '.json');
          fs.writeFile(cardPath, JSON.stringify(card, null, '  '), cb);
        }
      },
      function(err) {
        if(err) { return cb(err); }
        ok();
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

