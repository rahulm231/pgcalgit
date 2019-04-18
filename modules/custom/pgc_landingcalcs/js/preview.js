(function($){
  Drupal.behaviors.giftCalcs = {
    attach: function() {
      $('.lcPreview').click(function(){
        var appID = Drupal.settings.pgc_landingcalcs.app_id;
        var giftType = $(this).data('gift-type');
        var instanceId = $(this).parents('.draggable').find('.delta-order').find('select').val();
        window.open("/landingcalcsPreview.php?portalID="+appID+"&giftType="+giftType+"&instance="+instanceId, 'lcPreview', 'width=370,height=500');
      });
    }
  };
})(jQuery);