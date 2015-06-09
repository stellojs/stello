
/**
 * The stello harness main file
 *
 * @package stello
 * @copyright 2015 jtrussell
 */
module.exports = {

  /**
   * Initialize your stello workspace
   *
   * Prompts the user for various config items and saves them in a local
   * stellorc file. You may pass an options hash to circumvent interactive
   * prompts.
   *
   * The callback is passed an error, if there is one, and a final normalized
   * options hash.
   *
   * @param {Object} opts An options hash
   * @param {Function} cb The callback
   */
  init: require('./init'),

  /**
   * Pull data down from your Trello board
   *
   * @param {Object} opts An options hash
   * @param {Function} cb The callback
   */
  fetch: require('./fetch'),

  /**
   * Generate static files
   *
   * You musth ave run `stello.fetch` at least once.
   *
   * @param {Object} opts An options hash
   * @param {Function} cb The callback
   */
  build: require('./build'),

};
