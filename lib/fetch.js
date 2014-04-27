/*jshint regexp:false */

module.exports = function(opts, cb) {
  'use strict';

  var format = require('util').format
    , fs = require('fs')
    , path = require('path')
    , request = require('request')
    , async = require('async')
    , mkdirp = require('mkdirp')
    , after = require('after');

  var apiKey = opts.trelloApiKey
    , authToken = opts.trelloToken
    , boardId = opts.trelloBoardUrl
      .replace(/.*\/b\//, '')
      .replace(/\/.*$/, '')
    , pagesListName = opts.trelloBoardPagesList
    , blogListName = opts.trelloBoardBlogList;

  var tmpDir = path.join(opts.tmpDir, 'trello');

  var done = after(2, cb || function() {});

  var getBoardListIdByName = function(boardId, listName) {
    return function(cb) {
      var uri = format('https://api.trello.com/1/boards/%s/lists?key=%s&token=%s', boardId, apiKey, authToken);
      request(uri, function(error, resp, body) {
        if(error) { return cb(error); }
        var lists, ix;
        try {
          lists = JSON.parse(body);
        } catch(error) {
          return cb(error);
        }
        for(ix = lists.length; ix--;) {
          if(lists[ix].name === listName) {
            return cb(null, lists[ix].id);
          }
        }
        cb(new Error(format('Could not find a list %s in board %s.', listName, boardId)));
      });
    };
  };

  var getListCards = function(listId, cb) {
    var uri = format('https://api.trello.com/1/lists/%s/cards?key=%s&token=%s', listId, apiKey, authToken);
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

  var saveToTmpDirAs = function(filename) {
    return function(data, cb) {
      var filepath = path.join(tmpDir, filename);
      fs.writeFile(filepath, JSON.stringify(data), function(error) {
        return error ? cb(error) : cb();
      });
    };
  };

  mkdirp(tmpDir, function(error) {
    if(error) { return cb(error); }

    async.waterfall([
      getBoardListIdByName(boardId, pagesListName),
      getListCards,
      saveToTmpDirAs('pages.json')
    ], done);

    async.waterfall([
      getBoardListIdByName(boardId, blogListName),
      getListCards,
      saveToTmpDirAs('posts.json')
    ], done);
  });
};

