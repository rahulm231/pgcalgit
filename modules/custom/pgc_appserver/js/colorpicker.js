(function($) {
  Drupal.behaviors.PGCColorPicer = {
    attach: function() {
      $('.colorpicker-widget').ColorPicker({
        onChange: function (hsb, hex, rgb, el) {
          $(el).val('#' + hex);
        },
        onBeforeShow: function () {
          $(this).ColorPickerSetColor(this.value);
        }
      })
      .bind('keyup', function(){
        $(this).ColorPickerSetColor(this.value);
      });
    }
  }
})(jQuery);