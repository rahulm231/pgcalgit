Drupal.behaviors.pgc_giftcompare = {
  attach: function(context, settings) {
    $ = jQuery;
    $('.abbr-disabled').attr('readonly','readonly').css('background', '#eee');
  }
};

jQuery.fn.bindFirst = function(name, fn) {
  this.bind(name, fn);
  var handlers = this.data('events')[name.split('.')[0]];
  var handler = handlers.pop();
  handlers.splice(0, 0, handler);
};