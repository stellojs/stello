
'use strict';

var sh = require('shelljs')
  , fs = require('fs')
  , Handlebars = require('handlebars')
  , Trello = require('./trello')
  , async = require('async')
  , slug = require('slug')
  , path = require('path')
  , kramed = require('kramed');

var registerHelpers = function() {
  // We'll provide a `markdown` helper but do before registering uerland helpers
  // so they  can override use if desired
  Handlebars.registerHelper('markdown', function(markup, options) {
    return new Handlebars.SafeString(kramed(markup));
  });

  sh.ls('./src/helpers/*.js').forEach(function(f) {
    var helperName = path.basename(f, '.js')
      , helper = require(path.join(process.cwd(), f));
    Handlebars.registerHelper(helperName, helper);
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
  registerHelpers();
  sh.rm('-rf', 'dist');
  sh.mkdir('dist');

  var cardIndexTplFiles = sh.ls('src/index-card.*')
    , listIndexTplFiles = sh.ls('src/index-list.*')
    , hasCardIndexTpl = !!cardIndexTplFiles.length
    , hasListIndexTpl = !!listIndexTplFiles.length
    , t = new Trello(opts.trelloApiKey, opts.trelloToken);

  if(!hasCardIndexTpl && !hasListIndexTpl) {
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

  async.parallel([loadAllCards, loadAllLists], function(err, results) {
    if(err) { return cb(err); }
    var allCards = results[0]
      , allLists = results[1];

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
                card: card,
                allCards: allCards,
                allLists: allLists
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
  });
};
