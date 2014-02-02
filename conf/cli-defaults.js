
module.exports = function() {
  'use strict';

  return {

    /**
     * Build destination folder name
     *
     * Where your static site will be place when you run `stello build`
     */
    dest: 'dist',

    /**
     * Force a stello action
     *
     * For example, `stello init` will normally refuse to run if the current
     * working directy is non-empty.
     */
    force: false,

    /**
     * Where source files live
     *
     * I.e. the non-node_modules and build related stuff... just styles, views,
     * and scrits
     */
    src: 'app',

    /**
     * Where `stello` looks for temporary files
     *
     * E.g. compiled handlebars templates, process stylesheets... that sort of
     * thing.
     */
    tmpDir: '.stello-tmp',

    /**
     * Your Trello API key
     *
     * Used to read info from your Trello board. Log in to Trello and visit the
     * developer api keys page get get your key.
     *
     * @see https://trello.com/1/appKey/generate
     */
    trelloApiKey: '',

    /**
     * URL to the board driving your stello site
     */
    trelloBoardUrl: ''
  };
};
