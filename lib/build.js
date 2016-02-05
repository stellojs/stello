
'use strict';

var sh = require('shelljs')
  , fs = require('fs')
  , Handlebars = require('handlebars')
  , Trello = require('./trello')
  , async = require('async')
  , slug = require('slug')
  , path = require('path')
  , kramed = require('kramed');

var registerHelpers = function(allCards, allLists) {
  // We'll provide a `markdown` helper but do before registering uerland helpers
  // so they  can override use if desired
  Handlebars.registerHelper('markdown', function(markup, options) {
    return new Handlebars.SafeString(kramed(markup));
  });

  sh.ls('./src/helpers/*.js').forEach(function(f) {
    var helperName = path.basename(f, '.js')
      , helper = require(path.join(process.cwd(), f));
    Handlebars.registerHelper(helperName, helper(allCards, allLists));
  });
};

var registerPartials = function() {
  sh.ls('./src/partials/*.hbs').forEach(function(f) {
    var partialName = path.basename(f, '.hbs')
      , partial = sh.cat(path.join(process.cwd(), f));
    Handlebars.registerPartial(partialName, partial);
  });
};

var padTo = function(num, digits) {
  var strInt = '' + num;
  while(strInt.length < digits) {
    strInt = '0' + strInt;
  }
  return strInt;
};

module.exports = function(opts, cb) {
  sh.rm('-rf', 'dist');
  sh.mkdir('dist');

  var cardIndexTplFiles = sh.ls('src/index-card.*')
    , listIndexTplFiles = sh.ls('src/index-list.*')
    , boardIndexTplFiles = sh.ls('src/index-board.*')
    , hasCardIndexTpl = !!cardIndexTplFiles.length
    , hasListIndexTpl = !!listIndexTplFiles.length
    , hasBoardIndexTpl = !!boardIndexTplFiles.length
    , t = new Trello(opts.trelloApiKey, opts.trelloToken);

  if(!hasCardIndexTpl && !hasListIndexTpl && !hasBoardIndexTpl) {
    return cb(new Error('Could not find any index template files in src folder.'));
  }

  var cardIndexTplFile
    , cardIndexTplExt
    , cardTplSrc
    , cardTpl;
  if(hasCardIndexTpl) {
    cardIndexTplFile = cardIndexTplFiles[0];
    cardIndexTplExt = path.extname(path.basename(cardIndexTplFile, '.hbs')) || '.html';
    cardTplSrc = sh.cat(cardIndexTplFile);
    cardTpl = Handlebars.compile(cardTplSrc);
  }

  var listIndexTplFile
    , listIndexTplExt
    , listTplSrc
    , listTpl;
  if(hasListIndexTpl) {
    listIndexTplFile = listIndexTplFiles[0];
    listIndexTplExt = path.extname(path.basename(listIndexTplFile, '.hbs')) || '.html';
    listTplSrc = sh.cat(listIndexTplFile);
    listTpl = Handlebars.compile(listTplSrc);
  }

  var boardIndexTplFile
    , boardIndexTplExt
    , boardTplSrc
    , boardTpl;
  if(hasBoardIndexTpl) {
    boardIndexTplFile = boardIndexTplFiles[0];
    boardIndexTplExt = path.extname(path.basename(boardIndexTplFile, '.hbs')) || '.html';
    boardTplSrc = sh.cat(boardIndexTplFile);
    boardTpl = Handlebars.compile(boardTplSrc);
  }

  var loadAllCards = function(done) {
    t.getBoardCards(opts.trelloBoardUrl, function(err, cards) {
      if(err) { return done(err); }
      done(null, cards);
    });
  };

  var loadAllLists = function(done) {
    t.getBoardLists(opts.trelloBoardUrl, function(err, lists) {
      if(err) { return done(err); }
      done(null, lists);
    });
  };

  var loadBoard = function(done) {
    t.getBoard(opts.trelloBoardUrl, function(err, board) {
      if(err) { return done(err); }
      done(null, board);
    });
  };

  async.parallel([loadAllCards, loadAllLists, loadBoard], function(err, results) {
    if(err) { return cb(err); }
    var allCards = results[0]
      , allLists = results[1]
      , theBoard = results[2];

    registerHelpers(allCards, allLists);
    registerPartials();

    if(hasCardIndexTpl) {
      async.each(allCards,
        function(card, done) {
          var fileName = [
                'c',
                padTo(card.pos, 8),
                slug(card.name).toLowerCase() + cardIndexTplExt
              ].join('-')
            , filePath = 'dist/' + fileName
            , context = {
                allCards: allCards,
                allLists: allLists,
                card: card
              };
          fs.writeFile(filePath, cardTpl(context), done);
        },
        function(err) {
          return cb(err);
        });
    }

    if(hasListIndexTpl) {
      async.each(allLists,
        function(list, done) {
          var fileName = [
                'l',
                padTo(list.pos, 8),
                slug(list.name).toLowerCase() + listIndexTplExt
              ].join('-')
            , filePath = 'dist/' + fileName
            , context = {
                allCards: allCards,
                allLists: allLists,
                list: list,
                listCards: allCards.filter(function(c) {
                  return c.idList === list.id;
                })
              };
          fs.writeFile(filePath, listTpl(context), done);
        },
        function(err) {
          return cb(err);
        });
    }

    if(hasBoardIndexTpl) {
      var fileName = [
            'b',
            padTo('1', 8),
            slug(theBoard.name).toLowerCase() + boardIndexTplExt
          ].join('-')
        , filePath = 'dist/' + fileName
        , context = {
            allCards: allCards,
            allLists: allLists,
            board: theBoard
          };
      fs.writeFile(filePath, boardTpl(context), function(err) {
        if(err) { return cb(err); }
      });
    }
  });
};
