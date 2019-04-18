var SI = SI || {};

SI.styleBuilder = {
  settings: {},
  regions: [],
  $preview: {},
  $form: {},
  storedVal: [],

  selectorInfo: function(element) {
    var ret = {};
    var info = element.attr('data-selector').split('|');
    // Couple of common characters won't come through a POST,
    // so they're replaced on the back end and again here
    ret.selector = info[0];
    ret.safeName = element.attr('name').split('|')[0];
    ret.attr = info[1];
    ret.val = element.val();

    return ret;
  },

  init: function() {

    // Bind left/right buttons on style builder menu
    $("#style-builder .move .right").click(function() {
      $("#style-builder").css('right', '0');
      $("#style-builder").css('left', 'auto');
      $("#style-builder .move").css('right', '21px');
      $("#style-builder .move").css('left', 'auto');
      $(this).addClass('hidden');
      $("#style-builder .move .left").removeClass('hidden');
    });

    $("#style-builder .move .left").click(function() {
      $("#style-builder").css('left', '0');
      $("#style-builder").css('right', 'auto');
      $("#style-builder .move").css('left', '21px');
      $("#style-builder .move").css('right', 'auto');
      $(this).addClass('hidden');
      $("#style-builder .move .right").removeClass('hidden');
    });

    var $preview = $("#preview").contents();
    this.$preview = $preview;

    // Attempt to disable links
    $preview.find('a').click(function(e){ e.preventDefault(); });

    $preview.find('.contextual-links').css('display', 'none');

    var $form = $("#site_ingestor_style_builder");
    this.$form = $form;

    // Try to find the default values for each body style input
    $form.find('input[type=text]').each(function() {
      // Skip if field has an existing style filled in
      if($(this).val() != '') {
        var info = SI.styleBuilder.selectorInfo($(this));
        var computedStyle;
        if(info.attr != 'freeform' && info.selector.indexOf(':') < 0) {
          computedStyle = $preview.find(info.selector).css(info.attr);
          // Convert RGB color vals to hex
          if(computedStyle) {
            if(computedStyle.length > 0 && computedStyle.indexOf('rgb') > -1) {
              computedStyle = SI.styleBuilder.rgbToHex(computedStyle);
            }

            $(this).val(computedStyle);
          }
        }
      }
    });

    $("#style-builder input, #style-builder textarea").keyup(function() {
      var info = SI.styleBuilder.selectorInfo($(this));

      if(info.attr == 'freeform') {
        $preview.find('style[select-attr=\''+info.selector+'\']').remove();
        $preview.find('head').append('' +
          '<style class="stylebuilder" select-attr="'+info.selector+'">' +
          info.selector + ' { ' + info.val + ' }' +
          '</style>');

      }
      // Pseudo selectors cannot be set with JS, so we bind the hover style
      // manually. The others (active, visited) will not work.
      else if(info.selector.indexOf(':hover') > -1) {
        // Pull out the pseudo class
        var selector = info.selector.split(':')[0];
        $preview.find(selector).hover(function(){
          SI.styleBuilder.storedVal[info.safeName] = $(this).css(info.attr);
          $(this).css(info.attr, info.val)
        }, function() {
          $(this).css(info.attr, SI.styleBuilder.storedVal[info.safeName])
        });
      } else {
        $preview.find(info.selector).css(info.attr, info.val);
      }
    });

    $('.defaults input[type=checkbox]').click(function() {
        var section = $(this).data('section');
        if($(this).is(':checked')) {
          $('input[type=text][data-section='+section+'], textarea[data-section='+section+']').each(function() {
              var default_val = $(this).data('default');
              $(this).data('saved', $(this).val());
              $(this).val(default_val);
              $(this).trigger('keyup');
            }
          );
        } else {
          $('input[type=text][data-section='+section+'], textarea[data-section='+section+']').each(function() {
              var saved_val = $(this).data('saved');
              $(this).val(saved_val);
              $(this).trigger('keyup');
            }
          );
        }
      }
    )
  },

  rgbToHex: function(rgb) {
    var pattern = /rgb\(([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})\)/;
    var matches = rgb.match(pattern);
    var hex = '#' + this.componentToHex(matches[1]) + this.componentToHex(matches[2]) + this.componentToHex(matches[3]);

    return hex;
  },

  componentToHex: function(c) {
    c = parseInt(c);
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
};