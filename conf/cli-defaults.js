
module.exports = function() {
  'use strict';

  return {

    /**
     * Write config to stdout rather than disk
     *
     * Mostly for testing the cli
     */
    dryRun: false,

    /**
     * Force a stello action
     *
     * For example, `stello init` will normally refuse to run if the current
     * working directy is non-empty.
     */
    force: false,

    /**
     * Suppress non-error output
     */
    silent: false,

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
    trelloBoardBlogList: 'Blog',

    /**
     * Would you like to start working from a template?
     */
    installTemplate: true,

    /**
     * The template to start from
     *
     * Should be an `npm install`-able path
     */
    templateToInstall: 'stellojs/stello-tpl-default',

    /**
     * Whether or not to add `.stellorc` to the `.gitignore` file
     */
    gitIgnoreStellorc: true
  };
};
