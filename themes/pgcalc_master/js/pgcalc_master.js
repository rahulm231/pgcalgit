/**
 * @file
 * Contains js for the pgcalc_master theme components.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Attaches the JS test behavior to weight div.
   */
  Drupal.behaviors.pgcalcMaster = {
    attach: function (context, settings) {
      // Using percentage font size to easily increase/decrease page font size
      var baseFontSize = 100;
      $('.pgc-font-size a').click(function() {
        if($(this).hasClass('increase')) {
          if(baseFontSize < 150)
            baseFontSize += 20;
          $('.pg-content-body p').css('font-size', baseFontSize+'%');
        } else {
          if(baseFontSize > 70)
            baseFontSize -= 10;
          $('.pg-content-body p').css('font-size', baseFontSize+'%');
        }
      });

      // Print button
      /* replaced by code below as per PGCS-896
      $('.pgc-print a').click(function() {
        window.print();
      })
      */ 
      var href = window.location.href;			
	  if(href.indexOf("/pgc-print")!==-1){	  	
	  	window.print();
	  } 
	  
	  
	  // Gift Diagram
	  if($(window).width() < 415){
	    if($('#pgc-container .notify-mobile').length===0){
	      $( "#pgc-container" ).prepend( "<div class='notify-mobile' style='color: gray;font-style: italic;'>Please rotate your phone or tablet to use this calculator.</div>" );	
	    }
	  
	  }
	
	  $(window).resize(function() {
	    if($(window).width() > 414){
	      $("#pgc-container .notify-mobile").remove();
	    }else{
	      if($('#pgc-container .notify-mobile').length===0){
	        $( "#pgc-container" ).prepend( "<div class='notify-mobile' style='color: gray;font-style: italic;'>Please rotate your phone or tablet to use this calculator.</div>" );	
	      }	
	    }
	  });
			
	  // Accordion		
			
    }
  };
})(jQuery, Drupal, drupalSettings);
