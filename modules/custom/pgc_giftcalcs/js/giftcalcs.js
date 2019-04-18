(function($) {
  var farm = false;
  PGC.apps.giftCalcs = {
    title: 'Gift Calculator',
    fields: null,
    results: null,
    $app: null,
    $view: null,
    $focused: null,
    diagramModel: null,
    questionsModel: null,
    questionsForm: null,
    formError: null,
    numFormErrors: 0,
    mode: null,
    contactButtons: null,
    giftWarning: null,
    init: function() {
      // this.config.misc gets all profile fields from the giftcalcs profile
      // that start with 'field_gc_config_', with that part stripped off. For
      // other properties of this.config, see pgc_giftcalcs_js_compiler().
      this.config = JSON.parse(this.config);
      $('li.pgc-tab').text(this.config.calcLabels.gcHeaderLabel);
      // Set the background color
      if (typeof(this.config.misc.bg_color) != "undefined") {
        $('body').css('background-color', this.config.misc.bg_color);
      }
      // Build the GiftCalcs app container
      var appContainer = Mustache.render(this.config.templates.app, this.config);
      this.$app = $('#pgc-app');
      this.$app.html(appContainer);
      
      // #GEP-53 - Starts
      if(typeof(this.config.misc.square_corners) != 'undefined' &&  this.config.misc.square_corners === "1") {
      	this.$app.find('#pgc-gc-wrap').css('border-radius', '0px');
      }      
      // #GEP-53 - Ends
      
      // Build the results view
      this.$view = $('#pgc-gc');

      // If we have a previous calculation ID, load it
      if (window.location.hash.indexOf('#gc') === 0) {
        var previousCalculationId = window.location.hash.substr(4);
        this.loadPreviousCalculation(previousCalculationId);
      }
      // Otherwise load the configuration and display the default/selected gift type
      else {
        if (this.config.giftType == 'none') {
          // #GEP-4 - starts  Diagram and Questions are managed by same variables, First time diagram needed to show for "All Gifts" while  on Question section Gift type doesn't include "All Gifts", so they needed different default values in case All Gifts is selected for Default Diagram.
          // this.setGiftType(this.config.giftTypeDefault); // changed to below conditional lines
          
          if(this.config.giftTypeDefault=='all'){
          	this.setGiftType(this.config.giftTypeDefaultforAll);	
          }else{
            this.setGiftType(this.config.giftTypeDefault);	
          }
          this.setDefaultDiagramGiftType(this.config.giftTypeDefault);
          // #GEP-4 ends
          this.config.showGiftTypeSelect = true;          
        } else {
          this.setGiftType(this.config.giftType);
          // #GEP-4 starts
          this.setDefaultDiagramGiftType(this.config.giftType);
          // #GEP-4 ends
        }
        // Render the results view
        this.mode = this.config.misc.open_input == '1' ? 'customize' : 'results';
        this.render();
      }
    },
    loadPreviousCalculation: function(calcGUID) {
      var data = {WSGUID: this.config.wsguid, CalculationGUID: calcGUID};
      $('.gc-loader').fadeIn('fast',
              $.proxy(function() {
        data.wsURL = this.config.wsURLs.retrieveCalculation;
        $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(data)),
                $.proxy(function(r) {
          this.results = r;
          this.config.giftType = this.mapWSGiftType(this.results.GiftType);
          this.mode = 'results';
          this.results.finished = true;
          this.render();
          $('.gc-loader').fadeOut(400, function() {
            socket.postMessage($("#pgc-app-container").css('height').replace('px', ''));
          });
        }, this)
                );
      }, this)
              );
    },
    mapWSGiftType: function(WSID) {
      var types = {
        g: 'ga',
        d: 'dga',
        a: 'crat',
        u: 'crut',
        l: 'clat',
        t: 'clut',
        p: 'pif',
        // #GEP-13 - starts here
        p2: 'pif2',
        p3: 'pif3',
        p4: 'pif4',
        p5: 'pif5',
        // #GEP-13 - ends here
        q: 'bqt',
        r: 'rle'
      }

      return types[WSID];
    },
    setGiftType: function(giftType) {
      this.config.giftType = giftType;
      this.buildQuestionsModel();
    }, // #GEP-4 - starts - Set default value for Default diagram separtely from question section
    setDefaultDiagramGiftType: function(giftType) {
      this.config.DefaultDiagramGiftType = giftType;
    }, // #GEP-4 - ends
    buildContactButtons: function() {
      this.contactButtons = [];
      if ((typeof this.config.misc.cb1_label !== 'undefined' && this.config.misc.cb1_label != '') || (typeof this.config.misc.cb1_icon !== 'undefined' && this.config.misc.cb1_icon != '')) {
        /* #GEP-56 - Starts */
        //this.contactButtons.push({label: this.config.misc.cb1_label, url: this.config.misc.cb1_url, icon: this.config.misc.cb1_icon});
        this.contactButtons.push({label: this.config.misc.cb1_label, url: this.config.misc.cb1_url, icon: this.config.misc.cb1_icon, index: 1});
        /* #GEP-56 - Ends */
      }
      
      if ((typeof this.config.misc.cb2_label !== 'undefined' && this.config.misc.cb2_label != '') || (typeof this.config.misc.cb2_icon !== 'undefined' && this.config.misc.cb2_icon != '')) {
        /* #GEP-56 - Starts */
        //this.contactButtons.push({label: this.config.misc.cb2_label, url: this.config.misc.cb2_url, icon: this.config.misc.cb2_icon});
        this.contactButtons.push({label: this.config.misc.cb2_label, url: this.config.misc.cb2_url, icon: this.config.misc.cb2_icon, index: 2});
        /* #GEP-56 - Ends */
      }
    },
    bindResultsView: function() {
      // Customize button
      this.$view.find('.gc-btn-customize').on('click', $.proxy(function() {
        this.$view.fadeOut('fast', $.proxy(function() {
          this.mode = 'customize';
          this.render();
          this.$view.fadeIn('fast', function() {
            socket.postMessage($("#pgc-app-container").css('height').replace('px', ''));
          });
        }, this));

      }, this));

      // Print button
      this.$view.find('.gc-print').on('click', $.proxy(function() {
        // Hide things we don't want to print
        $('.gc-noprint').css('visibility', 'hidden');
        $('#pgc-gc .gc-btns').css('visibility', 'hidden');
        window.print();
        $('.gc-noprint').css('visibility', 'visible');
        $('#pgc-gc .gc-btns').css('visibility', 'visible');
      }, this));
	  
      // Add colors
      if (typeof(this.config.misc.btn_bg_color) != 'undefined') {
        this.$view.find('.gc-btn').css('background-color', this.config.misc.btn_bg_color);
      }
      if (typeof(this.config.misc.btn_color) != 'undefined') {
        this.$view.find('.gc-btn').css('color', this.config.misc.btn_color);
      }

      // Add styles for icon labels.
      if (typeof(this.config.misc.icon_labels_fs) != 'undefined') {
        this.$view.find('.gcd-label').css('font-size', this.config.misc.icon_labels_fs);
      }

      if (typeof(this.config.misc.icon_labels_col) != 'undefined') {
        this.$view.find('.gcd-label').css('color', this.config.misc.icon_labels_col);
      }

      if (this.config.misc.icon_labels_stl !== undefined) {
        this.setFontStyle(this.config.misc.icon_labels_stl, this.$view.find('.gcd-label'));
      }

      if (typeof(this.config.misc.icon_labels_font) != 'undefined') {
        this.$view.find('.gcd-label').css('font-family', this.config.misc.icon_labels_font);
      }


      // General tab font styles.
      if (typeof(this.config.misc.oo_label_fs) != 'undefined') {
        $('li.pgc-tab').css('font-size', this.config.misc.oo_label_fs);
      }

      if (typeof(this.config.misc.oo_label_col) != 'undefined') {
        $('li.pgc-tab').css('color', this.config.misc.oo_label_col);
      }

      if (this.config.misc.oo_label_stl !== undefined) {
        this.setFontStyle(this.config.misc.oo_label_stl, $('li.pgc-tab'));
      }

      if (typeof(this.config.misc.oo_label_font) != 'undefined') {
        $('li.pgc-tab').css('font-family', this.config.misc.oo_label_font);
      }


      // Buttons font styles.
      // #GEP-5 Buttons Overridden
      /*
      if (typeof(this.config.misc.buttons_fs) != 'undefined') {
        $('.gc-btn span.gc-label').css('font-size', this.config.misc.buttons_fs);
      }

      if (typeof(this.config.misc.buttons_col) != 'undefined') {
        $('.gc-btn').css('color', this.config.misc.buttons_col);
      }

      if (this.config.misc.buttons_stl !== undefined) {
        this.setFontStyle(this.config.misc.buttons_stl, $('.gc-btn span.gc-label'));
      }

      if (typeof(this.config.misc.buttons_font) != 'undefined') {
        $('.gc-btn span.gc-label').css('font-family', this.config.misc.buttons_font);
      }
      */
      
      // Personalize button
      if (typeof(this.config.misc.buttons_fs) != 'undefined') {
        $('.gc-btn-customize span.gc-label').css('font-size', this.config.misc.buttons_fs);
      }

      if (typeof(this.config.misc.buttons_col) != 'undefined') {
        $('.gc-btn-customize').css('color', this.config.misc.buttons_col);
      }

      if (this.config.misc.buttons_stl !== undefined) {
        this.setFontStyle(this.config.misc.buttons_stl, $('.gc-btn-customize span.gc-label'));
      }

      if (typeof(this.config.misc.buttons_font) != 'undefined') {
        $('.gc-btn-customize span.gc-label').css('font-family', this.config.misc.buttons_font);
      }
      
      if (typeof(this.config.misc.buttons_bg) != 'undefined') {
        this.$view.find('.gc-btn-customize').css('background-color', this.config.misc.buttons_bg);
      }
      
      // Contact Buttons
      if (typeof(this.config.misc.cu_buttons_fs) != 'undefined') {
        $('.gc-contact-btn-1 span.gc-label').css('font-size', this.config.misc.cu_buttons_fs);
      }

      if (typeof(this.config.misc.cu_buttons_col) != 'undefined') {
        $('.gc-contact-btn-1').css('color', this.config.misc.cu_buttons_col);
      }

      if (this.config.misc.cu_buttons_stl !== undefined) {
        this.setFontStyle(this.config.misc.cu_buttons_stl, $('.gc-contact-btn-1 span.gc-label'));
      }

      if (typeof(this.config.misc.cu_buttons_font) != 'undefined') {
        $('.gc-contact-btn-1 span.gc-label').css('font-family', this.config.misc.cu_buttons_font);
      }
      
      if (typeof(this.config.misc.cu_buttons_bg) != 'undefined') {
        this.$view.find('.gc-contact-btn-1').css('background-color', this.config.misc.cu_buttons_bg);
      }
      
      // Contact Buttons
      if (typeof(this.config.misc.pe_buttons_ic) != 'undefined') {
        $('.gc-icon').css('color', this.config.misc.pe_buttons_ic);
      }
      
      if (typeof(this.config.misc.pe_buttons_bg) != 'undefined') {
        this.$view.find('.gc-icon').css('background-color', this.config.misc.pe_buttons_bg);
      }
      
      // #GEP-5 Ends here

      // How it works styles.
      if (typeof(this.config.misc.hiw_label_fs) != 'undefined') {
        $('.gc-gift-details h2').css('font-size', this.config.misc.hiw_label_fs);
      }

      if (typeof(this.config.misc.hiw_label_col) != 'undefined') {
        $('.gc-gift-details h2').css('color', this.config.misc.hiw_label_col);
      }

      if (this.config.misc.hiw_label_stl !== undefined) {
        this.setFontStyle(this.config.misc.hiw_label_stl, $('.gc-gift-details h2'));
      }

      if (typeof(this.config.misc.hiw_label_font) != 'undefined') {
        $('.gc-gift-details h2').css('font-family', this.config.misc.hiw_label_font);
      }

      if (typeof(this.config.misc.hiw_text_fs) != 'undefined') {
        $('.gc-gift-details .gift-descriptions').css('font-size', this.config.misc.hiw_text_fs);
      }

      if (typeof(this.config.misc.hiw_text_col) != 'undefined') {
        $('.gc-gift-details .gift-descriptions').css('color', this.config.misc.hiw_text_col);
      }

      if (this.config.misc.hiw_text_stl !== undefined) {
        this.setFontStyle(this.config.misc.hiw_text_stl, $('.gc-gift-details .gift-descriptions'));
      }

      if (typeof(this.config.misc.hiw_text_font) != 'undefined') {
        $('.gc-gift-details .gift-descriptions').css('font-family', this.config.misc.hiw_text_font);
      }

      if (typeof(this.config.misc.ttu_fs) != 'undefined') {
        $('h2.gc-contact-headline').css('font-size', this.config.misc.ttu_fs);
      }

      if (typeof(this.config.misc.ttu_col) != 'undefined') {
        $('h2.gc-contact-headline').css('color', this.config.misc.ttu_col);
      }

      if (this.config.misc.ttu_stl !== undefined) {
        this.setFontStyle(this.config.misc.ttu_stl, $('h2.gc-contact-headline'));
      }

      if (typeof(this.config.misc.ttu_font) != 'undefined') {
        $('h2.gc-contact-headline').css('font-family', this.config.misc.ttu_font);
      }
      
      // #GEP-53 - Starts
      if(typeof(this.config.misc.square_corners) != 'undefined' &&  this.config.misc.square_corners === "1") {
      	this.$view.find('.gc-btn').css('border-radius', '0px');
      }
      // #GEP-53 - Ends

      // Add calculation GUID to email link (if we have a calculation)
      if (this.results != null) {
        var calcGUID = this.results.CalculationGUID;
        window.location.hash = '#gc=' + calcGUID;
        socket.postMessage(window.location.hash);
      }
      var $emailBtn = this.$view.find('.gc-email');
      $emailBtn.click(function(e) {
        e.preventDefault();
        socket.postMessage('sendmail');
      });
      // Adjust font size down if < 650px wide (works in IE7 where media queries do not)
      if (parseInt(this.$app.css('width')) < 650) {
        this.$view.find('.gcd-label').css('font-size', '12px');
      }
    },
    setFontStyle: function(style, element) {
      if (typeof style === 'string') {
        style = [style];
      }
      for (var i = 0; i < style.length; i++) {
        switch (style[i]) {
          case 'bold':
            element.css('font-weight', style[i]);
            break;
          case 'italic':
            element.css('font-style', style[i]);
            break;
          case 'underline':
            element.css('text-decoration', style[i]);
            break;
        }
      }
    },
    bindCustomizeView: function() {
      // Text field update blur
      this.$view.find('input').on('blur', $.proxy(function(event) {
        var questionId = $(event.target).attr('id');
        var questionObj = this.questionsModel[questionId];
        if ($(event.target).val() != this.questionsModel[questionId].value) {
          this.questionsModel[questionId].value = $(event.target).val();
          // Add validation binding (if exists)
          if (typeof(questionObj.wsParam) != 'undefined'
                  && typeof(this.config.validation[this.config.giftType][questionObj.wsParam]) != 'undefined') {
            var rule = this.config.validation[this.config.giftType][questionObj.wsParam];
            this.questionsModel[questionId].error = this.validate($(event.target), rule);
            $(event.target).siblings('.gc-error').html(this.questionsModel[questionId].error);
          }
          // Maintain focus if there is an error
          if (this.questionsModel[questionId].error) {
            this.$focused = $(event.target);
            setTimeout(function() {
              PGC.apps.giftCalcs.$focused.focus()
            }, 1);
          }
          // This is a kludge... I don't want to re-render the form just to clear the
          // "Please correct any errors.." message, so after validating each field
          // I look for any field error containers that contain an error, and if there
          // aren't any, I remove the form error
          if ($('.gc-customize-form-errors').html().length && !$('.gc-error:contains(" ")').length) {
            $('.gc-customize-form-errors').html('');
          }
        }
      }, this));      
      

      // Select field update
      this.$view.find('select').on('change', $.proxy(function(event) {
        var questionId = $(event.target).attr('id');
        for (var i = 0; i < this.questionsModel[questionId].options.length; i++) {
          if (this.questionsModel[questionId].options[i].value == $(event.target).val()) {
            this.questionsModel[questionId].options[i].selected = 'selected';
          } else {
            this.questionsModel[questionId].options[i].selected = '';
          }
        }        
        

        // Update the model value
        this.questionsModel[questionId].value = $(event.target).val();

        // Special handling for gift type field
        if (questionId == 'giftType') {
          this.setGiftType(this.questionsModel[questionId].value);
        }

        // Re-render the form so that dependent questions are displayed
        this.render();
		// If we've changed gift type, make sure all fields are displayed
		if (questionId == 'giftType'){
          $("#B2").trigger("change");
          
          // #GEP-9 - Starts
          $(".gc-error").text('');
          $(".gc-customize-form-errors").text('');
          // #GEP-9 - Ends
        }

        socket.postMessage($("#pgc-app-container").css('height').replace('px', ''));

        // Refocus this field after form re-render 
        // #GEP-69 - Starts here
        //$('#dk_container_' + $(event.target).attr('id')).focus();
        $('#' + $(event.target).attr('id')).focus();
        // #GEP-69 - Ends here

        // If the element that was targeted next was the submit button, press it
        if ($(event.relatedTarget).attr('id') == 'gc-customize-submit') {
          this.calculate();
        }
      }, this));
      
      // #GEP-1 - Starts      
      // checkbox field on click
      this.$view.find('input[type=checkbox]').on('click', $.proxy(function(event) {
        var questionId = $(event.target).attr('id');
        var questionObj = this.questionsModel[questionId];
        if (this.questionsModel[questionId].value === 0) {
            this.questionsModel[questionId].value = 1;
            this.questionsModel[questionId].checked = 'checked';
        } else {
            this.questionsModel[questionId].value = 0;
            this.questionsModel[questionId].checked = '';
        }
        this.render();
      }, this));   
      
      // Textarea update blur
      this.$view.find('textarea').on('blur', $.proxy(function(event) {
        var questionId = $(event.target).attr('id');
        var questionObj = this.questionsModel[questionId];
        if ($(event.target).val() != this.questionsModel[questionId].value) {
          this.questionsModel[questionId].value = $(event.target).val();         
        }
      }, this));         
      
      // #GEP-1 - Ends

      this.$view.find('#gc-customize-submit').on('click', $.proxy(function(event) {
        this.customizeSubmit();
      }, this));

      // Dropkick JS for custom select fields // #GEP-69 - commented below line
      //this.$view.find('.custom-select').dropkick({'startSpeed': '0'});

      // Add colors
      if (typeof(this.config.misc.btn_bg_color) != 'undefined') {
        this.$view.find('.gc-btn').css('background-color', this.config.misc.btn_bg_color);
        this.$view.find('.gc-btn-cancel').css('color', this.config.misc.btn_bg_color);
      }
      if (typeof(this.config.misc.btn_color) != 'undefined') {
        this.$view.find('.gc-btn').css('color', this.config.misc.btn_color);
        this.$view.find('.gc-btn-cancel').css('background-color', '#fff');
      }
      
      // #GEP-53 - Starts
      
      // Square corners
      if(typeof(this.config.misc.square_corners) != 'undefined' &&  this.config.misc.square_corners === "1") {
      	this.$view.find('.gc-btn').css('border-radius', '0px');
      	this.$view.find('.gc-btn-cancel').css('border-radius', '0px');
      }
      
      // Input style
      if(typeof(this.config.misc.input_style) != 'undefined') {
        //this.$view.find('.gc-form-select').attr('style', this.config.input_style);
        var inputStyle = this.$view.find('.gc-form-select').attr('style')
        if(inputStyle){
          this.$view.find('.gc-form-select').attr('style', inputStyle+this.config.misc.input_style);	
        }else{
          this.$view.find('.gc-form-select').attr('style', this.config.misc.input_style);	
        }
        this.$view.find('.gc-form-text').attr('style', this.config.misc.input_style);
      }
      
      // Submit button
      if (typeof(this.config.misc.sub_buttons_fs) != 'undefined') {
        this.$view.find('.gc-btn').css('font-size', this.config.misc.sub_buttons_fs);
      }

      if (typeof(this.config.misc.sub_buttons_col) != 'undefined') {
        this.$view.find('.gc-btn').css('color', this.config.misc.sub_buttons_col);
      }

      if (this.config.misc.sub_buttons_stl !== undefined) {
        this.setFontStyle(this.config.misc.sub_buttons_stl, this.$view.find('.gc-btn'));
      }

      if (typeof(this.config.misc.sub_buttons_font) != 'undefined') {
        this.$view.find('.gc-btn').css('font-family', this.config.misc.sub_buttons_font);
      }
      
      if (typeof(this.config.misc.sub_buttons_bg) != 'undefined') {
        this.$view.find('.gc-btn').css('background-color', this.config.misc.sub_buttons_bg);
      }
      // Submit Button
      
      // Cancel button
      if (typeof(this.config.misc.cnl_buttons_fs) != 'undefined') {
        this.$view.find('.gc-btn-cancel').css('font-size', this.config.misc.cnl_buttons_fs);
      }

      if (typeof(this.config.misc.cnl_buttons_col) != 'undefined') {
        this.$view.find('.gc-btn-cancel').css('color', this.config.misc.cnl_buttons_col);
      }

      if (this.config.misc.cnl_buttons_stl !== undefined) {
        this.setFontStyle(this.config.misc.cnl_buttons_stl, this.$view.find('.gc-btn-cancel'));
      }

      if (typeof(this.config.misc.cnl_buttons_font) != 'undefined') {
        this.$view.find('.gc-btn-cancel').css('font-family', this.config.misc.cnl_buttons_font);
      }
      
      if (typeof(this.config.misc.cnl_buttons_bg) != 'undefined') {
        this.$view.find('.gc-btn-cancel').css('background-color', this.config.misc.cnl_buttons_bg);
      }
      // Cancel Button
      
      // #GEP-53 - Ends

      // Bind cancel button
      this.$view.find('.gc-btn-cancel').on('click', $.proxy(function(event) {
        this.$view.fadeOut('fast', $.proxy(function() {
          this.mode = 'results';
          this.render();
          this.$view.fadeIn('fast', function() {
            socket.postMessage($("#pgc-app-container").css('height').replace('px', ''));
          });
        }, this));
      }, this));

      // Add commas automatically in dollars fields
      this.$view.find('.gc-form-text.dollars').keyup(function(event) {
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
    },
    validate: function($field, rule) {
      var fieldValue = $field.val();
      var fieldID = $field.attr('id');
      if (fieldValue == '') {
        return 'Field cannot be blank';
      }
      for (var type in rule) {
        switch (type) {
          case 'float_min':
            parsedValue = fieldValue.replace(/[^\d\.\-\ ]/g, '');
            if (parseFloat(parsedValue) < parseFloat(rule[type]) || isNaN(parsedValue)) {
              // #GEP-9 - starts here
              // return 'Value must be at least ' + this.addCommas(rule[type]);
              var float_min_val = this.addCommas(rule[type]);
              float_min_val = float_min_val.slice(0, -3);
              return 'Value must be at least ' + float_min_val;
              // #GEP-9 - ends here
            }
            break;
          case 'float_max':
            parsedValue = fieldValue.replace(/[^\d\.\-\ ]/g, '');
            if (parseFloat(parsedValue) > parseFloat(rule[type]) || isNaN(parsedValue)) {              
              // #GEP-9 - starts here
              // return 'Value must be less than or equal to ' + this.addCommas(rule[type]);
              var float_max_val = this.addCommas(rule[type]);
              float_max_val = float_max_val.slice(0, -3);
              return 'Value must be less than or equal to ' + float_max_val;
              // #GEP-9 - ends here
            }
            break;

          case 'age_min':
            if (isNaN(fieldValue)) {
              return 'Age must be a number';
            }
            if (parseInt(fieldValue) < parseInt(rule[type])) {
              return 'Age must be at least ' + rule[type];
            }
            // Special rule for Deferred Gift Annuity
            // Sets the Gift Date default based on the age
            else if (this.config.giftType == 'dga') {
              this.calculateDGAGiftDate();
            }
            break;
          case 'age_max':
            if (isNaN(fieldValue)) {
              return 'Age must be a number';
            }
            if (parseInt(fieldValue) > parseInt(rule[type])) {
              return 'Age must be less than or equal to ' + rule[type];
            }
            // Special rule for Deferred Gift Annuity
            // Sets the Gift Date default based on the age
            else if (this.config.giftType == 'dga') {
              this.calculateDGAGiftDate();
            }
            break;

          case 'birthdate_act_age_min':
            var fromDate = fieldValue.split('/');
            if (!this.checkDateFormat(fromDate)) {
              return 'Date must be in format MM/DD/YYYY';
            }
            var toDate = $('#giftDate').val().split('/');
            var actuarialAge = PGC.dates.actuarialAge(
                    parseInt(fromDate[2]), parseInt(fromDate[0]), parseInt(fromDate[1]),
                    parseInt(toDate[2]), parseInt(toDate[0]), parseInt(toDate[1])
                    );
            if (actuarialAge === false)
              return 'Birthdate must be before Gift Date';
            if (parseInt(actuarialAge) < parseInt(rule[type])) {
              return 'Age must be at least ' + rule[type] + ' at date of gift';
            }
            // Special rule for Deferred Gift Annuity
            // Sets the Gift Date default based on the age
            else if (this.config.giftType == 'dga') {
              this.calculateDGAGiftDate();
            }
            break;
          case 'birthdate_act_age_max':
            var fromDate = fieldValue.split('/');
            this.checkDateFormat(fromDate);
            if (!this.checkDateFormat(fromDate)) {
              return 'Date must be in format MM/DD/YYYY';
            }
            var toDate = $('#giftDate').val().split('/');
            var actuarialAge = PGC.dates.actuarialAge(
                    parseInt(fromDate[2]), parseInt(fromDate[0]), parseInt(fromDate[1]),
                    parseInt(toDate[2]), parseInt(toDate[0]), parseInt(toDate[1])
                    );
            if (actuarialAge === false)
              return 'Birthdate must be before Gift Date';
            if (parseInt(actuarialAge) > parseInt(rule[type])) {
              return 'Age must be less than or equal to ' + rule[type] + ' at date of gift';
            }
            // Special rule for Deferred Gift Annuity
            // Sets the Gift Date default based on the age
            else if (this.config.giftType == 'dga') {
              this.calculateDGAGiftDate();
            }
            break;
          case 'date_min':
            parsedValue = fieldValue.split('/');
            if (!this.checkDateFormat(parsedValue)) {
              return 'Date must be in format MM/DD/YYYY';
            }
            var giftDate = this.questionsModel.giftDate.value;
            if (new Date(parsedValue) < new Date(giftDate.split('/'))) {
              return 'Date of first payment must be on or after gift date.';
            }
            var ageString = 'Age';
            if (this.questionsModel.B1.value == '2') {
              ageString = 'Both ages';
            }
            if (new Date(parsedValue) < new Date(rule[type].split('/'))) {
              var minDeferredAge = parseInt(this.config.validation.dga.FirstPaymentDate.min_def_age);
              return ageString + ' must be at least ' + minDeferredAge + ' on date of first payment.';
            }
            break;
          case 'date_max':
            parsedValue = fieldValue.split('/');
            if (!this.checkDateFormat(parsedValue)) {
              return 'Date must be in format MM/DD/YYYY';
            }
            var ageString = 'Age';
            if (this.questionsModel.B1.value == '2') {
              ageString = 'Both ages';
            }
            if (new Date(parsedValue) > new Date(rule[type].split('/'))) {
              var maxDeferredAge = parseInt(this.config.validation.dga.FirstPaymentDate.max_def_age);
              return ageString + ' must be less than or equal to ' + maxDeferredAge + ' on date of first payment.';
            }
            break;
          case 'costbasis':
            parsedValue = fieldValue.replace(/[^\d\.\-\ ]/g, '');
            if (isNaN(parseFloat(parsedValue))) {
              return 'Cost basis must be a number';
            }
            var propertyVal = $("#B10").val().replace(/[^\d\.\-\ ]/g, '');
            if (parseFloat(propertyVal) < parseFloat(parsedValue))
              return 'Cost basis must be less than or equal to value of property transferred';
            break;
          case 'buildingvalue':
            parsedValue = fieldValue.replace(/[^\d\.\-\ ]/g, '');
            if (isNaN(parseFloat(parsedValue))) {
              return 'Building value must be a number';
            }
            var propertyVal = $("#B10").val().replace(/[^\d\.\-\ ]/g, '');
            if (parseFloat(propertyVal) < parseFloat(parsedValue))
              return 'Building value must be less than or equal to value of property transferred';
            break;
          case 'dateformat':
            parsedValue = fieldValue.split('/');
            if (!this.checkDateFormat(parsedValue)) {
              return 'Date must be in format MM/DD/YYYY';
            }
            break;
        }
      }
      return '';
    },
    checkDateFormat: function(dateArray) {
      return !(dateArray.length != 3 || isNaN(dateArray[0]) || dateArray[0] < 1 || dateArray[0] > 12
              || isNaN(dateArray[1]) || dateArray[1] < 0 || dateArray[1] > 31
              || isNaN(dateArray[2]) || dateArray[2] < 1000 || dateArray[2] > 3000)
    },
    // "How it works" description, only present when there is no result
    buildResultDescription: function() {
      this.resultDescription = '';
      // Default details
      if (this.results == null) {
        this.resultDescription = '<h2>' + this.config.calcLabels.gcHiwLabel + '</h2>';
        // #GEP-4 - starts - Get description for Default Diagram type
         //this.resultDescription += '<div class="gift-descriptions">' + this.replaceVariables(this.config.gift_descriptions[this.config.giftType]) + '</div>'; // changed to below lines
        this.resultDescription += '<div class="gift-descriptions">' + this.replaceVariables(this.config.gift_descriptions[this.config.DefaultDiagramGiftType]) + '</div>';
        // #GEP-4 - ends
      }
    },
    // Builds calculation notes and disclaimer
    buildNotesAndDisclaimer: function() {
      this.notes = '';
      this.disclaimer = '';
      this.discountRate = '';
      this.invalidGift = '';
      if (this.results != null) {
        this.disclaimer = this.config.misc.disclaimer;

        // Short-term gain note
        if (this.config.giftType !== 'bqt' && this.config.notes[0] !== false) {
          this.notes += this.config.notes[0] + ' ';
        }

        // Partial Payments note
        var pp_excludes = ['bqt', 'rle'];
        if ($.inArray(this.config.giftType, pp_excludes) == -1) {
          if (this.config.notes[1] !== false)
            this.notes += this.config.notes[1] + ' ';
        }

        // Deferred Note
        if (this.config.giftType == 'ga') {
          if (this.config.notes[2] !== false)
            this.notes += this.config.notes[2] + ' ';
        }

        // NY/NJ note
        if (this.config.giftType == 'dga') {
          if (this.config.notes[3] !== false)
            this.notes += this.config.notes[3];
        }

        if (this.config.giftType == 'ga' || this.config.giftType == 'dga') {
          var messages = '';
          if (this.results.ExpReturnYearsMessage != null) {
            messages = this.results.ExpReturnYearsMessage + ' ';
          }
          if (this.results.ExpCapitalGainYearsMessage != null) {
            // GEP-61 - Starts Here
            //messages = this.results.ExpCapitalGainYearsMessage + ' ';
            messages = this.results.ExpCapitalGainYearsMessage + ' ' + this.results.ExpReturnYearsMessage + ' ';
            // GEP-61 - Ends Here
          }

          if (messages.length) {
            this.notes = messages + '<br /><br />' + this.notes;
          }
        }

        if (this.config.giftType != 'bqt') {
          var giftDate = this.results.GiftDate;
          if (giftDate.indexOf(' ') > -1) {
            giftDate = giftDate.substr(0, giftDate.indexOf(' '));
          }
          this.notes += '<br /><br />Gift Date is ' + giftDate + '.';
        }

        if ((typeof(this.results.PayoutFrequency) != "undefined" && typeof(this.results.PayoutTiming) != "undefined")
                && (this.results.PayoutFrequency != "" && this.results.PayoutTiming != "")) {
          var frequencies = {a: 'annual', s: 'semiannual', q: 'quarterly', m: 'monthly'};
          var timings = {b: 'beginning', e: 'end'};
          this.notes += '<br /><br />Payout schedule is ' + frequencies[this.results.PayoutFrequency] +
                  ' at ' + timings[this.results.PayoutTiming] + '.';
        }
        // Discount rate
        // GEP-13 - starts here
        // if (this.config.giftType != 'bqt' && this.config.giftType != 'pif')
        if (this.config.giftType != 'bqt' && this.config.giftType != 'pif' && this.config.giftType != 'pif2' && this.config.giftType != 'pif3' && this.config.giftType != 'pif4' && this.config.giftType != 'pif5')
        // GEP-13 - ends here
          this.discountRate = 'IRS Discount Rate is ' + this.results.IRSDiscountRate + '%.';
      }
    },
    buildDiagramModel: function() {
      this.diagramModel = {};
      // Default diagram
      var giftTypeAltTag = '' // #GEP-56
      if (this.results == null) {
      	// #GEP-4 - starts - Get image for default diagram type
        // this.diagramModel.image = this.config.diagrams[this.config.giftType].singular; //changed to below line
        this.diagramModel.image = this.config.diagrams[this.config.DefaultDiagramGiftType].singular;
        // #GEP-4 - ends
        
        // Diagram labels with variables
        for (var i = 1; i <= 5; i++) {
          // #GEP-4 - starts - Get image for default diagram type
          // this.diagramModel['label_' + i] = this.replaceVariables(this.config.diagram_labels[this.config.giftType].def[i]);
          this.diagramModel['label_' + i] = this.replaceVariables(this.config.diagram_labels[this.config.DefaultDiagramGiftType].def[i]);
          // #GEP-4 - ends
          // #GEP-56 - Starts Here 
          if (i == 3){
          	if(this.config.DefaultDiagramGiftType == 'all'){
          	  giftTypeAltTag = "planned gift";	
          	}else if(this.config.DefaultDiagramGiftType == 'pif' || this.config.DefaultDiagramGiftType == 'pif2' || this.config.DefaultDiagramGiftType == 'pif3' || this.config.DefaultDiagramGiftType == 'pif4' || this.config.DefaultDiagramGiftType == 'pif5'){
          	  giftTypeAltTag = "pooled income fund";	
          	}else if(this.config.DefaultDiagramGiftType == 'bqt'){
          	  giftTypeAltTag = "bequest to charity";	
          	}else if(this.config.DefaultDiagramGiftType == 'crat'){
          	  giftTypeAltTag = "charitable remainder annuity trust";	
          	}else if(this.config.DefaultDiagramGiftType == 'crut'){
          	  giftTypeAltTag = "charitable remainder unitrust";	
          	}else if(this.config.DefaultDiagramGiftType == 'clat'){
          	  giftTypeAltTag = "charitable lead annuity trust";	
          	}else if(this.config.DefaultDiagramGiftType == 'clut'){
          	  giftTypeAltTag = "charitable lead unitrust";	
          	}else{
          	  giftTypeAltTag = this.replaceVariables(this.config.diagram_labels[this.config.DefaultDiagramGiftType].def[i]); 	
          	}             	
          }          	        	
          // #GEP-56 - Ends Here 
        }
      }
      // Customized diagram
      else {
        // Singular or plural image
        if (this.results.Age2 > -1)
          this.diagramModel.image = this.config.diagrams[this.config.giftType].plural;
        else
          this.diagramModel.image = this.config.diagrams[this.config.giftType].singular;
        // Diagram labels with variables
        var label = '';
        for (var i = 1; i <= 5; i++) {
          label = this.config.diagram_labels[this.config.giftType].cust[i];
          if (i == 4)
            label += "<br/>"+this.addTermLength();
          this.diagramModel['label_' + i] = this.replaceVariables(label);
          // #GEP-56 - Starts Here 
          if (i == 3){
          	if(this.config.giftType == 'all'){
          	  giftTypeAltTag = "planned gift";	
          	}else if(this.config.giftType == 'pif' || this.config.giftType == 'pif2' || this.config.giftType == 'pif3' || this.config.giftType == 'pif4' || this.config.giftType == 'pif5'){
          	  giftTypeAltTag = "pooled income fund";	
          	}else if(this.config.giftType == 'ga'){
          	  giftTypeAltTag = "gift annuity";	
          	}else if(this.config.giftType == 'dga'){
          	  giftTypeAltTag = "deferred gift annuity";	
          	}else if(this.config.giftType == 'bqt'){
          	  giftTypeAltTag = "bequest to charity";	
          	}else if(this.config.giftType == 'crat'){
          	  giftTypeAltTag = "charitable remainder annuity trust";	
          	}else if(this.config.giftType == 'crut'){
          	  giftTypeAltTag = "charitable remainder unitrust";	
          	}else if(this.config.giftType == 'clat'){
          	  giftTypeAltTag = "charitable lead annuity trust";	
          	}else if(this.config.giftType == 'clut'){
          	  giftTypeAltTag = "charitable lead unitrust";	
          	}else if(this.config.giftType == 'cfu'){
          	  giftTypeAltTag = "flip unitrust";	
          	}else{
          	  giftTypeAltTag = this.replaceVariables(this.config.diagram_labels[this.config.giftType].cust[i]); 	
          	}             	
          }            
          // #GEP-56 - Ends Here
        }
      }
      // #GEP-56 - Starts Here 
      this.diagramModel.altTag = giftTypeAltTag.toLowerCase();; 
      // #GEP-56 - Ends Here      
    },
    // Provide an extra line for the customized diagram,label #4, depending on
    // the gift type and whether a fixed term has been specified.
    addTermLength: function() {
      var line = '';
      switch(this.config.giftType) {
        case 'crut':
        case 'cfu':
        case 'crat':
        case 'clat':
        case 'clut':
          line = (this.results.TermType == 'f')
            ? 'Payments made for [termLength] years'
            : 'Payments made for life'
          break;

        case 'rle':
          line = (this.results.TermType == 'f')
            ? 'Keep living in your home for [termLength] years'
            : 'Keep living in your home'
          break;

        case 'ga':
        case 'dga':
        case 'pif':
          line = 'Payments made for life'
        // #GEP-13 - starts here
        case 'pif2':
          line = 'Payments made for life'
        case 'pif3':
          line = 'Payments made for life'
        case 'pif4':
          line = 'Payments made for life'
        case 'pif5':
          line = 'Payments made for life'
        // #GEP-13 - ends here
          break;
      }

      return line;
    },
    replaceVariables: function(string) {
      var pattern = /\[([a-zA-Z0-9_]+)\]/;
      var match;
      if (string != '') {
        while ((match = pattern.exec(string)) != null) {
          var replaced = false;
          if (this.results != null) {
            var resultVariableMatch = this.resultVariableValues(match[1]);
            if (resultVariableMatch.length) {
              string = string.replace(match[0], resultVariableMatch);
              replaced = true;

              if (this.config.giftType == "rle"){
                if (farm){
                  if (match[1] == "giftAmount"){
                    // if 'Farm' is selected
                    string = string.replace("Home", "Farm");
                  }
                  else if (match[1] == "taxDeduction"){
                    string = string.replace("Keep living in your home", "Keep the use of your farm");
                  }
                }
              }
            }
          }
          var staticVariableMatch = this.staticVariableValues(match[1]);
          if (staticVariableMatch.length) {
            string = string.replace(match[0], staticVariableMatch);
            replaced = true;
            if (match[1] == "charity_nickname" && farm){
              string = string.replace("Home", "Farm");
            }
          }
          // If no replacement was found, break
          if (replaced == false) {
            break;
          }
        }
      }
      return string;
    },
    staticVariableValues: function(variableName) {
      var value = '';
      if (typeof(this.config.static_variables[variableName]) != 'undefined')
        value = this.config.static_variables[variableName];
      return value;
    },
    // These are calculated variable values for results
    resultVariableValues: function(variableName) {
      var value = '';

      switch (variableName) {
        case 'donors':
          if (this.results.TermType == 'f') {
            value = "One donor";
          }
          else if (this.results.Age2 == -1) {
            value = 'Donor,<br /><strong>' + this.results.Age1 + '</strong> years old';
          }
          else if (this.results.Age1 == 0 && this.results.Age2 == 0) {
            value = 'Two donors';
          }
          else if (this.results.Age1 == 0) {
            value = 'One donor';
          }
          else {
            value = 'Two donors,<br /><strong>'
                    + this.results.Age1 + '</strong> & <strong>'
                    + this.results.Age2 + '</strong> years old';
          }
          break;
        case 'giftAmount':
          value = '<strong>$' + this.addCommas(this.results.GiftAmount.toFixed(0)) + '</strong><br />';
          break;
        case 'propertyType':
          var propertyTypes = {c: 'Cash', l: 'Long term gain property'};
          value = propertyTypes[this.results.PropertyType];
          break;
        case 'paymentRate':
          value = '<strong>' + this.results.PaymentRate + '%</strong>';
          break;
        case 'giftType':
          value = this.config.gifttype_labels[this.config.giftType];
          break;
        case 'taxDeduction':
          value = '<strong>$' + this.addCommas(this.results.CharitableDeduction.toFixed(0)) + '</strong>';
          break;
        // #GEP-51 - Starts
        case 'gainsNotTaxed':
          console.log(this.results);
          if (this.results.GainsNotTaxed > 0){
          	var textAlong = '';
        	if(this.results.GiftType=='g' || this.results.GiftType=='d' || this.results.GiftType=='p' || this.results.GiftType=='p2' || this.results.GiftType=='p3' || this.results.GiftType=='p4' || this.results.GiftType=='p5' || this.results.GiftType=='r'){
        	  textAlong = 'Gains not taxed';
        	}
        	if(this.results.GiftType=='a' || this.results.GiftType=='u'){
        	  textAlong = 'Gains that may not be taxed';
        	}        	  
          	if (this.results.GiftType=='r'){
        	  value = '<strong>$' + this.addCommas(this.results.GainsNotTaxed.toFixed(0)) + '</strong> ' + textAlong;	
        	}else{
        	  value = '<strong>$' + this.addCommas(this.results.GainsNotTaxed.toFixed(0)) + '</strong> ' + textAlong + '<br />';
        	}  
          }else{
            value = ' ';
          }
          break;
        // #GEP-51 - Ends
        case 'annualPayments':
          if(this.results.AnnualPayment)
          value = '<strong>$' + this.addCommas(this.results.AnnualPayment.toFixed(0)) + '</strong>';
          break;
        case 'charityAmount':
          value = '<strong>$' + this.addCommas(this.results.TotalReportableGain.toFixed(0)) + '</strong>';
          break;
        case 'firstPaymentYear':
          var date = this.results.FirstPaymentDate;
          var year = date.substr(date.lastIndexOf('/') + 1, 4);
          value = '<strong>' + year + '</strong>';
          break;
        case 'firstYearPayments':
          value = '<strong>$' + this.addCommas(this.results.FirstYearIncome.toFixed(0)) + '</strong>';
          break;
        case 'costBasis':
          if (this.results.PropertyType != 'c')
            value = '<strong>$' + this.addCommas(this.results.CostBasis.toFixed(0)) + '</strong><br />Cost basis';
          else
            value = ' ';
          break;
        case 'taxFreePortion':
          if (this.results.TaxFreePortion > 0)
            value = '<strong>$' + this.addCommas(this.results.TaxFreePortion.toFixed(0)) + '</strong> Tax-free portion';
          else
            value = ' ';
          break;
        case 'capitalGainPortion':
          if (this.results.CapitalGainPortion > 0){
          	if (this.results.TaxFreePortion > 0){
          	  value = '<br /><strong>$' + this.addCommas(this.results.CapitalGainPortion.toFixed(0)) + '</strong> Capital gain portion';
            }else{
          	  value = '<strong>$' + this.addCommas(this.results.CapitalGainPortion.toFixed(0)) + '</strong> Capital gain portion';
            }        
          }else{
          	value = ' ';
          }            
          break;
        // #GEP-62 - Starts
        case 'ordinaryIncome':
          if (this.results.OrdinaryIncome > 0)
            value = '<br /><strong>$' + this.addCommas(this.results.OrdinaryIncome.toFixed(0)) + '</strong> Ordinary income portion';
          else
            value = ' ';
          break;
        // #GEP-62 - Ends
        case 'termLength':
          value = '<strong>' + this.results.TermLength + '</strong>';
          break;
        // #GEP-64 - Starts
        case 'propertyDonated':
          value = this.config.questions['B36'].value;
          if(this.config.questions['B36'].value == 'h'){
              value = 'Home';
          }
          if(this.config.questions['B36'].value == 'f'){
              value = 'Farm';
          }
          break;
        // #GEP-64 - Ends
      }

      return value;
    },
    buildQuestionsModel: function() {
      // Kluge for the Term Type configuration.
      if ('B2' in this.config.questions) {
        question = this.config.questions['B2'];
        question.value = this.config.giftType in question.all_values
          ? question.all_values[this.config.giftType].value
          : question.default_value;

        // Add "number of years" gift term to CRUT/CRAT/CLAT/CFU/RLE.
        if (PGC.in_array(this.config.giftType, ['crut', 'crat', 'clat', 'clut', 'cfu', 'rle'])) {
          // Don't add it if it already exists.
          // #GEP-11 - Starts
          /*
          if (question.options.length == 2) {
          	  question.options.push({text: "Number of years", value: "f"});
          }*/
          
          var x = true;
          for (prop in question.options){
		    if (question.options[prop]['value'] === 'f'){
		      x = false;
		    }
		  } 
		  if(x){
		    question.options.push({text: "Number of years", value: "f"});	
		  }
		  // #GEP-11 - Ends
        }
        else {
          // #GEP-11 - Starts
          /*
          if (question.options.length == 3) {
            question.options.splice(2, 1);
          }*/
          for (prop in question.options){
		    if (question.options[prop]['value'] === 'f'){
		      question.options.splice(question.options.length-1, 1);
		    }
		  }   
		  // #GEP-11 - Ends       
        }
      }
      
      // #GEP-15 - Starts      
      if ('B12' in this.config.questions) {
        question = this.config.questions['B12'];
        var placeholderObj = this.config.placeholders;
        var giftTypeName = this.config.giftType;
        $.each(placeholderObj, function(key, value) {      	  
	      if(key==giftTypeName){
	        question.placeholder = value.min_gift;
	      }
	    });
      } 
      
      if ('B10' in this.config.questions) {
        question = this.config.questions['B10'];
        var placeholderObj = this.config.placeholders;
        var giftTypeName = this.config.giftType;
        $.each(placeholderObj, function(key, value) {      	  
	      if(key==giftTypeName){
	        question.placeholder = value.min_gift;
	      }
	    });
      }   
      
      if ('B3' in this.config.questions) {
        question = this.config.questions['B3'];
        var placeholderObj = this.config.placeholders;
        var giftTypeName = this.config.giftType;
        $.each(placeholderObj, function(key, value) {      	  
	      if(key==giftTypeName){
	        question.placeholder = value.min_age;
	      }
	    });
      }    
      
      if ('B4' in this.config.questions) {
        question = this.config.questions['B4'];
        var placeholderObj = this.config.placeholders;
        var giftTypeName = this.config.giftType;
        $.each(placeholderObj, function(key, value) {      	  
	      if(key==giftTypeName){
	        question.placeholder = value.min_age;
	      }
	    });
      }     
      // #GEP-15 - Ends
      
      // #GEP-57 - Starts
      if ('giftDate' in this.config.questions) {
      	question = this.config.questions['giftDate'];
      	if(this.config.misc.gar_table=="acgacurrent.gar"){
      		if(this.config.giftType=='ga' || this.config.giftType=='dga'){
      			question.helpText = "(Enter 7/1/2018 or later to use new higher annuity rate.)";	
      		}else{
      			question.helpText = "";
      		}      		      		
      	}
      }    
      // #GEP-57 - Ends
      
      this.questionsModel = {};
      for (var questionId in this.config.questions) {
        if (this.config.questions.hasOwnProperty(questionId)) {
          var question = this.config.questions[questionId];
          question.id = questionId;
          if (typeof(question.value) == 'undefined')
            question.value = '';
          if (question.giftType == 'all' || question.giftType == this.config.giftType) {
            this.questionsModel[questionId] = question;
            // Fix "selected" values on select fields
            if (question.type == 'select') {
              for (var i = 0; i < this.questionsModel[questionId].options.length; i++) {
                this.questionsModel[questionId].options[i].selected
                  = this.questionsModel[questionId].options[i].value == question.value
                  ? 'selected' : '';
              }
            }
          }
        }
      }
    },
    checkFieldError: function(field) {

    },
    checkCondition: function(condition) {
      var questionId = condition[0],
              testValue = condition[1],
              operator = condition[2]; 
      switch (operator) {
        case '=':
          return (this.questionsModel[questionId].value == testValue);
          break;
        case '!=':
          return (this.questionsModel[questionId].value != testValue);
          break;
      }
      console.log('PGC GiftCalcs: Invalid operator found: ' + operator);
      return false;
    },
    buildQuestionsForm: function() {
      this.formError = null;
      var questionsForm = {topLeft: '', topRight: '', bottomLeft: '', bottomRight: '', contactLeft: '', contactRight: ''};
      questionLoop:
              for (var questionId in this.questionsModel) {
        if (this.questionsModel.hasOwnProperty(questionId)) {
          var question = this.questionsModel[questionId];
          // Test for a single condition
          if (typeof(question.condition) !== "undefined") {
            if (!this.checkCondition(question.condition)) {
              // skip this question
              this.questionsModel[questionId].enabled = false;
              continue;
            }
          }
          // Test multiple conditions
          else if (typeof(question.conditions) != "undefined") {
            // Look for "AND" conditions
            if (typeof(question.conditions.and) != "undefined") {
              for (var i = 0; i < question.conditions.and.length; i++) {
                if (!this.checkCondition(question.conditions.and[i])) {
                  // skip this question
                  this.questionsModel[questionId].enabled = false;
                  continue questionLoop;
                }
              }
            }
            // Look for "OR" conditions
            var pass = false;
            if (typeof(question.conditions.or) != "undefined") {
              for (var i = 0; i < question.conditions.or.length; i++) {
                if (this.checkCondition(question.conditions.or[i])) {
                  pass = true;
                  break;
                }
              }
              if (!pass) {
                // skip this question
                this.questionsModel[questionId].enabled = false;
                continue;
              }
            }
          }
          // All conditions have passed, question is enabled
          this.questionsModel[questionId].enabled = true;
          if (question.required) {
            question.required = '*';
          } else {
            question.required = '';
          }
          switch (question.type) {
            case 'select':
              questionsForm[question.container] += Mustache.render(this.config.templates.form_select, question);
              break;
            case 'input':
              questionsForm[question.container] += Mustache.render(this.config.templates.form_input, question);
              break;
            // #GEP-1 - Starts
            case 'checkbox':
              questionsForm[question.container] += Mustache.render(this.config.templates.form_checkbox, question);
              break;
            case 'textarea':
              questionsForm[question.container] += Mustache.render(this.config.templates.form_textarea, question);
              break;
            // #GEP-1 - Ends
            case 'hidden':
              questionsForm[question.container] += Mustache.render(this.config.templates.form_hidden, question);            
              break;
          }
          if (typeof(this.questionsModel[questionId].error) !== 'undefined' && this.questionsModel[questionId].error != '')
            this.formError = 'Please correct the highlighted fields to continue.';
          this.numFormErrors += 1;
        }
      }
      this.questionsForm = questionsForm;
    },
    render: function() {
      switch (this.mode) {
        // Results/Diagram view
        case 'results':
          this.buildDiagramModel();
          this.buildResultDescription();
          this.buildContactButtons();
          this.buildNotesAndDisclaimer();
          this.$view.html(
                  Mustache.render(
                  this.config.templates.results,
                  {
                    diagram: this.diagramModel,
                    description: this.resultDescription,
                    contactHeadline: this.config.misc.cb_headline,
                    buttons: this.contactButtons,
                    disclaimer: this.disclaimer,
                    notes: this.notes,
                    discountRate: this.discountRate,
                    personalizeLabel: this.config.misc.personalize_btn
                  }
          )
                  );
          this.bindResultsView();
          break;
          // Customization form view
        case 'customize':
          if (this.questionsModel === null)
            this.buildQuestionsModel();
          this.buildQuestionsForm();
          this.$view.html(
                  Mustache.render(
                  this.config.templates.customize,
                  {
                    topLeft: this.questionsForm.topLeft,
                    topRight: this.questionsForm.topRight,
                    bottomLeft: this.questionsForm.bottomLeft,
                    bottomRight: this.questionsForm.bottomRight,
                    contactLeft: this.questionsForm.contactLeft,
                    contactRight: this.questionsForm.contactRight,
                    formError: this.formError,
                    giftWarning: this.giftWarning,
                    submitLabel: this.config.misc.sub_buttons_txt, // #GEP-53
                    cancelLabel: this.config.misc.cnl_buttons_txt // #GEP-53
                  }
          ));
          this.bindCustomizeView();
          break;
      }
      setTimeout('socket.postMessage(jQuery1110("#pgc-app-container").css("height").replace("px", ""));', 500);
    },
    customizeSubmit: function() {
      // Do a final validation check
      // This time it checks all fields, rather than
      // only those which have been touched
      var formHasErrors = false;
      for (var id in this.questionsModel) {
        var questionObj = this.questionsModel[id];
        if (questionObj.enabled
                && typeof(questionObj.wsParam) != 'undefined'
                && typeof(this.config.validation[this.config.giftType][questionObj.wsParam]) != 'undefined') {
          var rule = this.config.validation[this.config.giftType][questionObj.wsParam];
          var validationResult = this.validate($('#' + id), rule);
          if (validationResult.length) {
            this.questionsModel[id].error = validationResult;
            formHasErrors = true;
          }
        }
        // #GEP-67 - Starts here
        if(questionObj.id == 'giftType' && questionObj.value=='select'){
      	  this.questionsModel[id].error = "Must select a gift type";
          formHasErrors = true;
        }
        // #GEP-67 - Ends here   
      }
      if (formHasErrors) {
        // If validation turned up errors, re-render the form
        // with the errors visible
        this.formError = 'Please correct the highlighted fields to continue';
        this.render();
      } else {
      	// #GEP-9 - starts
      	for (var id in this.questionsModel) {
          var questionObj = this.questionsModel[id];
          if (questionObj.enabled
                && typeof(questionObj.wsParam) != 'undefined'
                && typeof(this.config.validation[this.config.giftType][questionObj.wsParam]) != 'undefined') {
            delete this.questionsModel[id].error;
          }
        }
        delete this.questionsModel['giftType'].error; // #GEP-67
        // #GEP-9 - ends
        this.calculate();
      }
    },
    buildCalcParams: function() {
      var giftType = this.config.giftType;
      // Build the calculation parameters
      var calcParams = {};
      for (var id in this.questionsModel) {
        if (this.questionsModel[id].enabled) {
	  if (id == "B36" && this.questionsModel[id].value == "f"){
            farm = true;
          }else if (id == "B36" && this.questionsModel[id].value != "f"){
            farm = false;
          }
          if (typeof(this.questionsModel[id]['wsParam']) != 'undefined') {
            calcParams[this.questionsModel[id]['wsParam']] = this.questionsModel[id]['value'];            
          }
        }
      }

      // Remove commas and any other characters from dollar value fields
      if (typeof(calcParams.BuildingValue) != 'undefined')
        calcParams.BuildingValue = calcParams.BuildingValue.replace(/[^\d\.\-\ ]/g, '');
      if (typeof(calcParams.CostBasis) != 'undefined')
        calcParams.CostBasis = calcParams.CostBasis.replace(/[^\d\.\-\ ]/g, '');
      if (typeof(calcParams.GiftAmount) != 'undefined')
        calcParams.GiftAmount = calcParams.GiftAmount.replace(/[^\d\.\-\ ]/g, '');

      // Age parameter
      if (calcParams.GiftTerm == 'a') {
        // Age2 needs to be -1 if not provided
        if (typeof(calcParams.Age2) == 'undefined')
          calcParams.Age2 = "-1";
        // Birthdates need to be blank for ages
        calcParams.Birthdate1 = '';
        calcParams.Birthdate2 = '';
      }

      // Birthdate2 parameter
      if (calcParams.GiftTerm == 'b') {
        if (typeof(calcParams.Birthdate2) == 'undefined')
          calcParams.Birthdate2 = "";
      }

      // Cost basis = Gift Amount for cash
      if (calcParams.PropertyType == 'c')
        calcParams.CostBasis = calcParams.GiftAmount;

      // For cash gifts, we need a default DonorBeneficiary
      // x for two lives, n for one
      if (calcParams.PropertyType == 'c') {
        if (calcParams.Age2 == '-1') {
          calcParams.DonorBeneficiary = 'n';
        } else {
          calcParams.DonorBeneficiary = 'x';
        }
      }

      // CRUT/CRAT/CLAT/CLUT/CFU/RLE use a unique Term Type that piggybacks on the GiftTerm
      if (PGC.in_array(giftType, ['crut', 'crat', 'clat', 'clut', 'cfu', 'rle'])) {
        if (calcParams.GiftTerm == 'a' || calcParams.GiftTerm == 'b')
          calcParams.TermType = 'a';
        else {
          // For fixed term length, we need to provide empty birthdates
          calcParams.TermType = 'f';
          calcParams.Birthdate1 = "";
          calcParams.Birthdate2 = "";
        }
      }

      // Need to set defaults for SalvageValue, EstimatedUsefulLife, Property Type, and Cost Basis
      // On RLE
      if (giftType == 'rle') {
        calcParams.SalvageValue = calcParams.BuildingValue * .1;
        calcParams.EstimatedUsefulLife = 45;
        calcParams.PropertyType = 'l';
        /* #GEP-51 - Starts here
        calcParams.CostBasis = calcParams.GiftAmount; */
      }

      // Add the IRS discount rate setting
      if (typeof(this.config.discountRates[giftType]) !== 'undefined')
        calcParams.IRSDiscountRate = this.config.discountRates[giftType];
      else
        calcParams.IRSDiscountRate = 0;

      if (giftType == 'dga' || giftType == 'ga')
        calcParams.PaymentRoundingMethod = 'a';

      return calcParams;
    },
    extractDonorData: function(calcParams) {
      var donorData = {};
      for (var key in calcParams) {
        if (key.indexOf('contact_') === 0) {
          donorData[key.replace('contact_', '')] = calcParams[key];
          delete calcParams[key];
        }
      }
      var length = 0;
      for (var prop in donorData) {
        if (donorData.hasOwnProperty(prop))
          length++;
      }
      if (length > 0)
        return donorData;
      else
        return false;
    },
    postDonorData: function(calcParams) {
      var app = this;
      var donorData = this.extractDonorData(calcParams);
      if (donorData !== false) {
        donorData.CalculationGUID = calcParams.CalculationGUID;
        donorData.WSGUID = this.config.wsguid;
        donorData.wsURL = this.config.wsURLs.donorData;
        $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(donorData)),
                function(data) {
                  // do nothing
                });
      }
    },
    calculate: function() {
      $('.gc-loader').fadeIn('fast', $.proxy(function() {
        var calcParams = this.buildCalcParams();
        if (this.config.giftType == 'ga' || this.config.giftType == 'dga') {
          // Gift Annuity and Deferred Gift Annuity need to do rate table look-ups
          calcParams.GARTable = this.config.misc.gar_table;
          if (this.config.giftType == 'ga') {
            calcParams.Recalculate = 0;
          }
          if (this.config.giftType == 'dga') {
            calcParams.Recalculate = 1;
          }

          calcParams.wsURL = this.config.wsURLs.annuityRateLookup;
          calcParams.LogInput = 'GiftCalcs';
          $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(calcParams)),
                  $.proxy(function(data) {
            calcParams.PaymentRate = data.PaymentRate;
            this.postCalculation(calcParams);
          }, this)
                  );
        }
        else {
          // #GEP-13 - Starts here
          if (this.config.giftType == 'pif' || this.config.giftType == 'pif2' || this.config.giftType == 'pif3' || this.config.giftType == 'pif4' || this.config.giftType == 'pif5') {
          	if(this.config.giftType == 'pif2'){
          	  calcParams.GiftType = 'p2';	
          	}else if(this.config.giftType == 'pif3'){
          	  calcParams.GiftType = 'p3';
          	}else if(this.config.giftType == 'pif4'){
          	  calcParams.GiftType = 'p4';
          	}else if(this.config.giftType == 'pif5'){
          	  calcParams.GiftType = 'p5';
          	}else{
          	  calcParams.GiftType = 'p';	
          	}
            calcParams.GiftLabel = 	this.config.giftType+"-"+this.config.gifttype_labels[this.config.giftType];
          }
          // #GEP-13 - Ends here
          this.postCalculation(calcParams);
        }
      }, this));
    },
    postCalculation: function(data) {
      var url = this.config.wsURLs[this.config.giftType];
      data.wsURL = url;
      data.LogInput = 'GiftCalcs';
      $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(data)),
              $.proxy(function(r) {
        data.CalculationGUID = r.CalculationGUID;
        this.postDonorData(data);
        this.processCalculationResults(r);
      }, this)
              );
    },
    processCalculationResults: function(r) {
      this.results = r;
      if (this.results.InvalidGiftWarning) {
        this.mode = 'customize';
        this.giftWarning = this.results.InvalidGiftWarning;
      } else {
        this.mode = 'results';
        this.results.finished = true;
        if (typeof(this.config.misc.send_emails) != "undefined" && this.config.misc.send_emails == true) {
          this.sendUsageEmail();
        }
        // #GEP-7 - Starts Here
        this.giftWarning = null;
        // #GEP-7 - Ends Here
      }
      this.render();
      $('.gc-loader').fadeOut(400, function() {
        socket.postMessage($("#pgc-app-container").css('height').replace('px', ''));
      });

    },
    sendUsageEmail: function() {
      var data = {
        WSGUID: this.config.wsguid,
        CalculationGUID: this.results.CalculationGUID,
        EmailAddress: this.config.misc.email,
        LogInput: 'GiftCalcs',
      };

      var url = this.config.wsURLs.email;

      data.wsURL = url;
      $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(data)),
              $.proxy(function(r) {
        // Do nothing
      }, this)
              );
    },
    addCommas: function(n) {
      var rx = /(\d+)(\d{3})/;
      return String(n).replace(/^\d+/, function(w) {
        while (rx.test(w)) {
          w = w.replace(rx, '$1,$2');
        }
        return w;
      });
    },
    // Sets validation rules for the "date of first payment" for a DGA.
    // See PGCS-63 for the rules to follow.
    calculateDGAGiftDate: function() {
      var paymentDate;
      var age;
      var age1 = null;
      var age2 = null;
      if (this.questionsModel.B2.value == 'a') {
        age1 = this.questionsModel.B3.value;
        age2 = this.questionsModel.B4.value;
      } else {
        var now = new Date();
        if (this.questionsModel.B5.value.length) {
          var bday1 = this.questionsModel.B5.value.split('/');
          age1 = PGC.dates.actuarialAge(
                  parseInt(bday1[2]), parseInt(bday1[0]), parseInt(bday1[1]),
                  now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
                  );
        }
        if (this.questionsModel.B6.value.length) {
          var bday2 = this.questionsModel.B6.value.split('/');
          age2 = PGC.dates.actuarialAge(
                  parseInt(bday2[2]), parseInt(bday2[0]), parseInt(bday2[1]),
                  now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
                  );
        }
      }
      age1 = parseInt(age1);
      age2 = parseInt(age2);
      if (isNaN(age1))
        minAge = maxAge = age2;
      else if (isNaN(age2))
        minAge = maxAge = age1;
      else if (age1 < age2) {
        minAge = age1;
        maxAge = age2;
      }
      else {
        minAge = age2;
        maxAge = age1;
      }

      var thisYear = new Date().getFullYear();
      var minDeferredAge = parseInt(this.config.validation.dga.FirstPaymentDate.min_def_age);
      var maxDeferredAge = parseInt(this.config.validation.dga.FirstPaymentDate.max_def_age);
      var minYear = thisYear + minDeferredAge - minAge;
      var maxYear = thisYear + maxDeferredAge - maxAge;

      // Set minimum and maximum date validators on the "Date of first payment"
      // field.
      this.config.validation.dga.FirstPaymentDate.date_min = '12/31/' + minYear;
      this.config.validation.dga.FirstPaymentDate.date_max = '12/31/' + maxYear;
    }

  };
})(jQuery1110);
