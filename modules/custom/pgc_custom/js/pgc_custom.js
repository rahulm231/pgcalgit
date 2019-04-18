(function ($, Drupal, window, document, undefined) {

	Drupal.behaviors.pgc_custom = {
		attach: function(context, settings) { 
		   
		 var href = $(location).attr('href');		
		 if(href.indexOf("gifttypes")!==-1){
		   var giftTypeArray = ['bqt','ga','dga','crut','cfu','crat','pif','pif2','pif3','pif4','pif5','rle','clat','clut'];
		   
		   var arrayLength = giftTypeArray.length;
		   
		   for (var i = 0; i < arrayLength; i++) {
		       giftTypeName = giftTypeArray[i];
		       var fieldMaxGiftAmount = '#edit-profile-gifttypes-field-'+giftTypeName+'-max-gift-und-0-value';
		       var fieldMinGiftAmount = '#edit-profile-gifttypes-field-'+giftTypeName+'-min-gift-und-0-value';
		     
		     
		       $(fieldMaxGiftAmount).keyup(function(event) {
	               // skip for arrow keys
	               if (event.which >= 37 && event.which <= 40) {
	                   event.preventDefault();
	               }
	               var value = $(this).val();
	               value = value.replace(/,/g, '');
	               var parts = value.toString().split(".");
	               parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	               $(this).val(parts.join('.'));
	           }); 	
	           
	           $(fieldMinGiftAmount).keyup(function(event) {
		           // skip for arrow keys
		           if (event.which >= 37 && event.which <= 40) {
		             event.preventDefault();
		           }
		           var value = $(this).val();
		           value = value.replace(/,/g, '');
		           var parts = value.toString().split(".");
		           parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		           $(this).val(parts.join('.'));
	           }); 
	         
	           if($(fieldMaxGiftAmount).val()!=''){
		           var value = $(fieldMaxGiftAmount).val();
	               value = value.replace(/,/g, '');
	               var parts = value.toString().split(".");
	               parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	               // $(fieldMaxGiftAmount).val(parts.join('.'));	
	               $(fieldMaxGiftAmount).val(parts[0]);	
		       }
		     
		       if($(fieldMinGiftAmount).val()!=''){
		           var value = $(fieldMinGiftAmount).val();
	               value = value.replace(/,/g, '');
	               var parts = value.toString().split(".");
	               parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	               //$(fieldMinGiftAmount).val(parts.join('.'));	
	               $(fieldMinGiftAmount).val(parts[0]);	
		       }
		       
		       // #GEP-28 - Starts
		       var fieldEnabledGiftType = '#edit-profile-gifttypes-field-'+giftTypeName+'-enabled-und';
		       var fieldEnabledGiftTypeId = '.form-item-profile-gifttypes-field-'+giftTypeName+'-enabled-und';
		       var fieldDescriptionId = '.form-item-profile-gifttypes-field-'+giftTypeName+'-description-und-0-value'; // #GEP-59
		       if($(fieldEnabledGiftType).is(":checked")){		       	 
		       	 giftTab = "fieldset.group-"+giftTypeName+" .fieldset-wrapper .form-wrapper .form-item";
		         $(giftTab).each(function (e){
		         	if (!$(this).hasClass("form-type-textarea") && !$(this).hasClass("form-type-checkbox")) { // #GEP-59
		         		$(this).not(fieldEnabledGiftTypeId).find('label').append('<span class="form-required" title="This field is required.">*</span>');
		         	}
		         });
		       }
		       // #GEP-28 - Ends
		   }
		   
		   // #GEP-28 - Starts
		   $('.form-type-checkbox:not(.form-item-profile-gifttypes-field-bqt-in-gifttype-menu-und) .form-checkbox').click(function(){ // #GEP-68
		     if (this.checked) {
		       $(this).closest('fieldset').find('.form-item').not('.form-type-checkbox').each(function (e){
			     if (!$(this).hasClass("form-type-textarea") && !$(this).hasClass("form-type-checkbox")) { // #GEP-59
		           $(this).find('label').append('<span class="form-required" title="This field is required.">*</span>');
		         }
		       });
			 }else{
			   $(this).closest('fieldset').find('.form-item').not('.form-type-checkbox').each(function (e){
		         $(this).find('label').find('span').remove();
		       });	
			 }
		   });
		   // #GEP-28 - Ends
		   
		   $('.page-user-edit-gifttypes #user-profile-form #edit-submit').click(function(e){
		   		e.preventDefault();
	           for (var j = 0; j < arrayLength; j++) {
	               giftTypeN = giftTypeArray[j];
	               
	               var fieldMaxGA = '#edit-profile-gifttypes-field-'+giftTypeN+'-max-gift-und-0-value';
		           var fieldMinGA = '#edit-profile-gifttypes-field-'+giftTypeN+'-min-gift-und-0-value';
		           
		           var fieldMaxGAVal = $('#edit-profile-gifttypes-field-'+giftTypeN+'-max-gift-und-0-value').val();
		           var fieldMinGAVal = $('#edit-profile-gifttypes-field-'+giftTypeN+'-min-gift-und-0-value').val();

					$(fieldMaxGA).val(fieldMaxGAVal.replace(/,/g, ""));
					$(fieldMinGA).val(fieldMinGAVal.replace(/,/g, ""));
	           }
	           $(this).closest('form').trigger('submit');
		   });
		 }
		 
		 // #GEP-1
		 if(href.indexOf("org")!==-1){
		   if($( "#edit-profile-org-field-di-contactme-display-und" ).val()===0){
		     $("#edit-profile-org-field-di-contactme-label-und-0-value").attr('disabled','1');
		     $('.form-item-profile-org-field-di-contactme-label-und-0-value').addClass('form-disabled');
		   }
		   $('#edit-profile-org-field-di-contactme-display-und').change(function(e){
		     if($(this).find(":selected").val()==0){
		       $("#edit-profile-org-field-di-contactme-label-und-0-value").attr('disabled','1');
		       $('.form-item-profile-org-field-di-contactme-label-und-0-value').addClass('form-disabled');	
		     }else{
		       $("#edit-profile-org-field-di-contactme-label-und-0-value").removeAttr('disabled');
		       $('.form-item-profile-org-field-di-contactme-label-und-0-value').removeClass('form-disabled');	
		     }
		   });
		 }
		 
		 // #GEP-24
		 if(href.indexOf("giftcalcs")!==-1){
		   $( "#sortable" ).sortable();
    	   $( "#sortable" ).disableSelection();
    	   
    	   $('.page-user-edit-giftcalcs #user-profile-form .form-submit').click(function(e){   
    	   	 	 
    	     e.preventDefault();	
    	     
    	     /* Below 2 lines are a hack to make simple select list to multiple, options were added in the list in form_alter because they are needed to be dynamic, if options are not added in field's setting page then select list behaves like a single option select */
    	     $('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').attr('multiple','multiple');
    	     
    	     if($('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').attr('name').indexOf("[]")===-1){
    	       var selectName = $('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').attr('name')+'[]';    	     
    	     
    	       $('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').attr('name',selectName);
    	       $('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').html('');
    	       $('#sortable li.ui-state-default').each(function(){
    	         var val = $(this).attr('id');
    	         var text = $(this).text();
	             $('select#edit-profile-giftcalcs-field-gc-config-gifttype-order-und').append( $('<option selected></option>').val(val).html(text) );
	           });
    	     }
    	     
    	     
	         $(this).closest('form').trigger('submit');
    	   });
    	   
    	 }
    	 
	  }
	}
})(jQuery, Drupal, this, this.document);



