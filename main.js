/*global jQuery */

/**
 * Main site scripts for Stello
 *
 * @copyright 2016 stellojs
 */

(function($) {
'use strict';

$('.the-public-key').on('change keyup',function() {
  var value = this.value;
  console.log(value);
});

}(jQuery));

