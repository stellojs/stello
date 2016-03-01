
module.exports = function() {
  'use strict';

  return {
    /**
     * Your Trello developer API key
     *
     * Used to read info from your Trello board. Log in to Trello and visit the
     * Trello developer API keys page get get your key.
     *
     * @see https://trello.com/1/appKey/generate
     */
    trelloApiKey: 'b705841c7bbc5fe0a0c7df2a4663d280',

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
    trelloToken: '5dc81dc8e918d0773e79c2a1492b5b8096790f270127c3b456ca24eb0171f730',

    /**
     * URL to the board driving your stello site
     */
    trelloBoardUrl: 'https://trello.com/b/bkEURdPR/stello-demo-board'
  };
};
