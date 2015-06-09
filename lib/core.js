
'use strict';

/**
 * Core functionality to expose to templates
 *
 * @package stello
 * @copyright 2015 jtrussell
 */

/**
 * Get cards sorted by position
 *
 * Optionally provide a list name (not case sensitive) to filter by. The
 * callback `cb` gets an error if there is one and any and all cards.
 *
 * @param {String} listName [optional] The name of the list to get cards for
 * @param {Function} cb The callback
 */
var getCards = function getCards(listName, cb) {
  if(typeof listName === 'function') {
    cb = listName;
    listName = null;
  }

  // ...
  if(cb) {
    cb(null, []);
  }
};

exports.getCards = getCards;
