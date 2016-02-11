/*global jQuery */

/**
 * Main site scripts for Stello
 *
 * @copyright 2016 stellojs
 */

(function($) {
'use strict';

$('.the-public-key').on('change keyup',function() {
  var value = this.value
    , $theTokenLink = $('.the-token-link')
  if(value) {
    $theTokenLink.removeClass('disabled');
    $theTokenLink.attr('href', 'https://trello.com/1/authorize?key=' + value + '&name=stello&scope=read&expiration=never&response_type=token');
  } else {
    $theTokenLink.addClass('disabled');
    $theTokenLink.attr('href', 'javascript:void(0)');
  }
});

}(jQuery));

