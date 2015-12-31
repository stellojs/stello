
'use strict';

var sh = require('shelljs')
  , fs = require('fs')
  , Handlebars = require('handlebars')
  , Trello = require('./trello')
  , async = require('async')
  , slug = require('slug')
  , path = require('path');

var registerHelpers = function() {
  sh.ls('./src/helpers/*.js').forEach(function(f) {
    var helperName = path.basename(f, '.js')
      , helper = require(path.join(process.cwd(), f));
    Handlebars.registerHelper(helperName, helper);
  });
};

module.exports = function(opts, cb) {
  registerHelpers();
  sh.rm('-rf', 'dist');
  sh.mkdir('dist');
  fs.readFile('./src/index.hbs', function(err, data) {
    if(err) { return cb(err); }
    var cardTplSrc = data.toString()
      , cardTpl = Handlebars.compile(cardTplSrc);

    var t = new Trello(opts.trelloApiKey, opts.trelloToken);

    t.getBoardCards(opts.trelloBoardUrl, function(err, cards) {
      if(err) { return cb(err); }

      async.each(cards,
        function(card, done) {
          fs.writeFile('dist/' + slug(card.name).toLowerCase() + '.html', cardTpl(card), done)
        },
        function(err) {
          cb(err);
        });
    });
  });
  cb();
};
