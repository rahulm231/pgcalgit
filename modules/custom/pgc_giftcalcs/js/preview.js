(function($){
  Drupal.behaviors.giftCalcs = {
    attach: function() {
      $('#gcPreview').click(function(){
        var appID = Drupal.settings.pgc_giftcalcs.app_id;
        // #GEP-4 - Add default gift type param
        var giftType = Drupal.settings.pgc_giftcalcs.gift_type;
        //window.open("/giftcalcsPreview.php?portalID="+appID, 'gcPreview', 'width=740,height=700');
        window.open("/giftcalcsPreview.php?portalID="+appID+"&giftType="+giftType, 'gcPreview', 'width=740,height=700');
        // #GEP-4
        
      });
    }
  };
})(jQuery);
