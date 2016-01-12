
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

  var indexTplFiles = sh.ls('src/index.*');

  if(!indexTplFiles.length) {
    return cb(new Error('Could not find index template file in src folder.'));
  }

  var indexTplFile = indexTplFiles[0]
    , indexTplExt = path.extname(path.basename(indexTplFile, '.hbs')) || '.html';

  fs.readFile(indexTplFile, function(err, data) {
    if(err) { return cb(err); }
    var cardTplSrc = data.toString()
      , cardTpl = Handlebars.compile(cardTplSrc);

    var t = new Trello(opts.trelloApiKey, opts.trelloToken);

    t.getBoardCards(opts.trelloBoardUrl, function(err, cards) {
      if(err) { return cb(err); }
      async.each(cards,
        function(card, done) {
          var fileName = [
                'c',
                padTo(card.pos, 8),
                slug(card.name).toLowerCase() + indexTplExt
              ].join('-')
            , filePath = 'dist/' + fileName
            , context = {
                allCards: cards,
                card: card
              };
          fs.writeFile(filePath, cardTpl(context), done)
        },
        function(err) {
          cb(err);
        });
    });
  });
  cb();
};
