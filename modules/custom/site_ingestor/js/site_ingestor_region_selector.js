var SI = SI || {};

jQuery(function() {
  SI.regionSelector.init();
});

SI.regionSelector = {
  settings: {},
  regions: [],
  init: function() {
    jQuery('a').click(function(e){ e.preventDefault(); });
    // Start the DOMSelection tool when a region is clicked
    jQuery('#region-selector .region').click(function(){
      targetRegion = jQuery(this);
      SetupDOMSelection();
    });

    // When saving, pull the values stored by the DOMSelection tool
    // and stuff them into hidden fields so they can be picked up on
    // the back end.
    jQuery('#region-selector .save').click(function(){
      jQuery('#site_ingestor_region_selector .btn.region').each(function(){
        var values = {};
        values.innerHTML = escape(jQuery(this).data('innerHTML'));
        values.xpath = jQuery(this).data('xpath');
        var id = jQuery(this).attr('id');
        var $hiddenInput = jQuery('input[name="'+id.replace('btn', 'form-region')+'"]');
        $hiddenInput.val(JSON.stringify(values));
      });
    });

    jQuery('.btn.edit').click(function() {
      jQuery('#site_ingestor_html_editor').css('display', 'block');
      jQuery('body').css('overflow', 'hidden');
      window.scrollTo(0, 0);
    });
    jQuery('.btn.cancel').click(function() {
      jQuery('#site_ingestor_html_editor').css('display', 'none');
      jQuery('body').css('overflow', 'scroll');
    });
  }
};
