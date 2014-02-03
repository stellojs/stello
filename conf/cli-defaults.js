
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
     * Your Trello developer API key
     *
     * Used to read info from your Trello board. Log in to Trello and visit the
     * Trello developer API keys page get get your key.
     *
     * @see https://trello.com/1/appKey/generate
     */
    trelloApiKey: '36b098cd2f27e59119805f49468cbe60',

    /**
     * The Trello token authirizing `stello` to read your information
     *
     * After getting your API key visit:
     * https://trello.com/1/authorize?key=***YOUR-KEY***&name=stello&scope=read&expiration=never&response_type=token
     * To generate an everlasting read only token that `stello` can use to pull
     * down your site content.
     *
     * @see https://trello.com/docs/gettingstarted/authorize.html
     */
    trelloToken : '06e598e6521e837bb3c9b7db6a6519dc48348b9ef97f8b186929c239f2d531fe',

    /**
     * URL to the board driving your stello site
     */
    trelloBoardUrl: 'https://trello.com/b/u4YdciVy/stello-boilerplate',

    /**
     * The name of the "Pages" list
     *
     * Cards on the first list with this name will be treated as pages on your
     * site.Name must match exactly.
     */
    trelloBoardPagesList: 'Pages',

    /**
     * The name of the "Blog" list
     *
     * Cards in the first list with this name will be treated as blog posts.
     * Name must match exactly.
     */
    trelloBoardBlogList: 'Blog'

  };
};
