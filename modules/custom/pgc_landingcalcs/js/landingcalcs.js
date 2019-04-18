(function($) {
  PGC.apps.landingCalcs = {
    $appContainer: null,
    $view: null,
    $form: null,
    $results: null,
    socket: null,
    errors: [],
    twoLife: false,
    init: function() {
      this.config = JSON.parse(this.config);
      this.$appContainer = $('#pgc-app');
      this.$appContainer.html(Mustache.render(this.config.templates.app, {'cssIncludes': this.config.cssIncludes}));
      this.$view = $('#landingCalcs');
      this.setBodyStyles();
      this.renderFormView();
      this.socket = new easyXDM.Socket({
        onReady: function() {
          setTimeout('PGC.apps.landingCalcs.socket.postMessage(jQuery1110("#pgc-app-container").css("height").replace("px", ""));', 500);
        }
      });
    },
    setBodyStyles: function() {
      var $body = $('body');
      $body.css('background', this.config.settings.bg_color);
      $body.css('color', this.config.settings.font_color);
      $body.css('font-family', this.config.settings.font_family);
      $body.css('font-size', this.config.settings.font_size);
    },
    renderFormView: function() {
      this.useBirthdates = !this.config.giftOptions.term_type == 'a';
      this.$view.html(Mustache.render(this.config.templates.form,
              {
                useBirthdates: this.useBirthdates,
                h1Text: this.config.settings.form_h1_text,
                formText: this.config.settings.form_text,
                buttonText: this.config.settings.form_button_text,
                showDeferred: this.config.giftType == 'dga'
              }
      ));
      this.$form = $('#calcForm');
      this.setFormStyles();
      this.bindFormView();
    },
    setFormStyles: function() {
      var $button = this.$form.find('.btn');
      $button.css('background', this.config.settings.button_bg_color);
      $button.css('color', this.config.settings.button_text_color);
      $button.css('font-size', this.config.settings.button_font_size);
      $button.css('font-family', this.config.settings.font_family);

      var $h1 = this.$form.find('h1');
      $h1.css('color', this.config.settings.h1_color);
      $h1.css('font-size', this.config.settings.h1_size);
      $h1.css('font-family', this.config.settings.h1_font_family);
      $h1.css('font-weight', this.config.settings.h1_font_weight);

      var $errors = this.$form.find('#errors');
      $errors.css('color', this.config.settings.error_text_color);
    },
    setResultsStyles: function() {
      var $h1 = this.$results.find('h1');
      $h1.css('color', this.config.settings.h1_color);
      $h1.css('font-size', this.config.settings.h1_size);
      $h1.css('font-family', this.config.settings.h1_font_family);
      $h1.css('font-weight', this.config.settings.h1_font_weight);

      var $h2 = this.$results.find('h2');
      $h2.css('color', this.config.settings.h2_color);
      $h2.css('font-size', this.config.settings.h2_size);
      $h2.css('font-weight', this.config.settings.h2_font_weight);

      var $button = this.$results.find('.btn');
      $button.css('background', this.config.settings.button_bg_color);
      $button.css('color', this.config.settings.button_text_color);
      $button.css('font-size', this.config.settings.button_font_size);
      $button.css('font-family', this.config.settings.font_family);
    },
    bindFormView: function() {
      var app = this;

      // Toggle one/two life inputs
      this.$form.find('input:radio[name="annuitants"]').change(function() {
        if ($(this).val() == 1) {
          app.twoLife = false;
          app.$form.find('.twoLife').css('display', 'none');
          setTimeout("PGC.apps.landingCalcs.updateHeight();", 2000);
        } else {
          app.twoLife = true;
          app.$form.find('.twoLife').css('display', 'inline');
          setTimeout("PGC.apps.landingCalcs.updateHeight();", 2000);
        }
      });

      // Adds commas automatically to gift amount field
      this.$form.find('#giftAmount').keyup(function(event) {
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

      this.$form.find('#calculate').click(function() {
        if (app.validate()) {
          if (app.calculate()) {
            app.renderResultsView();
          }
          else {
            app.displayErrors();
          }
        }
        else {
          app.displayErrors();
        }
      });
    },
    validate: function() {
      this.errors = [];
      var minAge = this.config.giftOptions.min_ben_age,
              maxAge = this.config.giftOptions.max_ben_age,
              ages = this.getAges(),
              minGift = parseInt(this.config.giftOptions.min_gift),
              maxGift = parseInt(this.config.giftOptions.max_gift),
              giftAmount = parseInt(this.$form.find('#giftAmount').val().replace(/,/g, '')),
              name = this.$form.find('#name').val();

      // Validate name field
      if (name == '') {
        this.errors.push('Please enter a name.');
      }
      // Validate ages
      for (var i = 0; i < ages.length; i++) {
        if (ages[i] != '' && !isNaN(ages[i])) {
          if (ages[i] > parseInt(maxAge)) {
            this.errors.push('Age' + (i ? ' 2' : '') + ' must be ' + maxAge + ' or lower.');
          }
          else if (ages[i] < parseInt(minAge)) {
            this.errors.push('Age' + (i ? ' 2' : '') + ' must be at least ' + minAge + '.');
          }
        }
        else {
          this.errors.push('Please enter a number in Age' + (i ? ' 2' : '') + ' field.');
        }
      }

      // Validate gift amount
      if (isNaN(giftAmount)) {
        this.errors.push('Please enter a number in Gift Amount field.');
      }
      else if (giftAmount < minGift) {
        this.errors.push('Gift amount must be at least $' + this.addCommas(minGift) + '.');
      }
      else if (giftAmount > maxGift) {
        this.errors.push('Gift amount must less than or equal to $' + this.addCommas(maxGift) + '.');
      }

      return !this.errors.length;
    },
    getAges: function() {
      var ages = [];
      if (this.useBirthdates) {

      }
      else {
        ages.push(parseInt($('#age1').val()));
        if (this.twoLife === true) {
          ages.push(parseInt($('#age2').val()));
        }
      }
      return ages;
    },
    displayErrors: function() {
      var errorsContainer = this.$form.find('#errors');
      var errorsHTML = '';
      for (var i = 0; i < this.errors.length; i++) {
        errorsHTML += this.errors[i];
        if (i != this.errors.length - 1) {
          errorsHTML += '<br />';
        }
      }
      errorsContainer.css('display', 'block');
      errorsContainer.html(errorsHTML);
      setTimeout("PGC.apps.landingCalcs.updateHeight();", 2000);
    },
    buildCalcParams: function() {
      var calcParams = {};

      // Ages
      if (!this.useBirthdates) {
        calcParams.Age1 = this.$form.find('#age1').val();
        if (this.twoLife) {
          calcParams.Age2 = this.$form.find('#age2').val();
        } else {
          calcParams.Age2 = "-1";
        }
        calcParams.Birthdate1 = '';
        calcParams.Birthdate2 = '';
      }

      calcParams.GiftAmount = this.$form.find('#giftAmount').val().replace(/,/g, '');
      calcParams.CostBasis = calcParams.GiftAmount;
      calcParams.PropertyType = 'c';
      calcParams.GiftDate = this.getTodaysDate();
      calcParams.GiftTerm = this.config.giftOptions.term_type;
      calcParams.PayoutFrequency = this.config.giftOptions.pay_frequency;
      calcParams.PayoutTiming = this.config.giftOptions.pay_timing;
      calcParams.WSGUID = this.config.wsguid;
      calcParams.DonorBeneficiary = this.twoLife ? 'x' : 'n';
      calcParams.IRSDiscountRate = "0";
      calcParams.PaymentRoundingMethod = 'a';
      calcParams.GARTable = this.config.misc.gar_table;
      calcParams.Recalculate = this.config.giftType == 'ga' ? "0" : "1";
      calcParams.PaymentRoundingMethod = 'a';

      if (this.config.giftType == 'dga') {
        calcParams.FirstPaymentDate = this.getDeferredDate(this.$form.find('#yearsDeferred').val());
      } else {
        calcParams.FirstPaymentDate = this.getTodaysPlus3MoDate();
      }

      return calcParams;
    },
    calculate: function() {
      var app = this;
      $('.loader').fadeIn('fast', function() {
        var calcParams = app.buildCalcParams();
        if (app.config.giftType == 'ga' || app.config.giftType == 'dga') {
          // Gift Annuity and Deferred Gift Annuity need to do rate table look-ups
          calcParams.GARTable = app.config.misc.gar_table;
          calcParams.Recalculate = "0";

          calcParams.wsURL = app.config.wsURLs.annuityRateLookup;
          calcParams.LogInput = 'LandingCalcs';
          $.get(app.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(calcParams)),
                  function(data) {
                    calcParams.PaymentRate = data.PaymentRate;
                    app.postCalculation(calcParams);
                  }
          );
        }
        else {
          app.postCalculation(calcParams);
        }
      });
    },
    postDonorData: function(calcParams) {
      var app = this;
      var donorData = {DonorFirstName: $('#name').val()};
      donorData.WSGUID = this.config.wsguid;
      donorData.CalculationGUID = calcParams.CalculationGUID;
      donorData.wsURL = this.config.wsURLs.donorData;
      $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(donorData)),
              function(data) {
                app.processCalculationResults(calcParams);
              });
    },
    postCalculation: function(data) {
      var app = this;
      var url = this.config.wsURLs[this.config.giftType];
      data.wsURL = url;
//      data.GiftDate = '';
      data.LogInput = 'LandingCalcs';
      $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(data)),
              function(r) {
                app.postDonorData(r);
              }
      );
    },
    processCalculationResults: function(r) {
      var app = this;

      this.results = r;

      if (typeof(this.config.misc.send_emails) != "undefined" && this.config.misc.send_emails == true) {
        this.sendUsageEmail();
      }

      this.renderResultsView();

      $('.loader').fadeOut(400, function() {
        setTimeout("PGC.apps.landingCalcs.updateHeight();", 2000);
      });
    },
    sendUsageEmail: function() {
      var data = {
        WSGUID: this.config.wsguid,
        CalculationGUID: this.results.CalculationGUID,
        EmailAddress: this.config.misc.email,
        LogInput: 'LandingCalcs',
      };

      var url = this.config.wsURLs.email;
      data.wsURL = url;
      $.get(this.config.proxyURL + '?data=' + encodeURIComponent(JSON.stringify(data)),
              function(r) {
                // Do nothing
              }
      );

    },
    renderResultsView: function() {
      this.$view.html(Mustache.render(this.config.templates.results,
              {
                annualPayment: this.addCommas(this.results.AnnualPayment.toFixed(0)),
                charitableDeduction: this.addCommas(this.results.CharitableDeduction.toFixed(0)),
                buttonText: this.config.settings.results_button_text,
                buttonLink: this.config.settings.results_button_link,
                resultsTitle: this.config.settings.results_title,
                disclaimer: this.getDisclaimer()
              }
      ));
      this.$results = this.$view.find('#results');
      this.setResultsStyles();
      setTimeout("PGC.apps.landingCalcs.updateHeight();", 2000);
    },
    updateHeight: function() {
      this.socket.postMessage($('#pgc-app-container').css('height').replace('px', ''));
    },
    getDisclaimer: function() {
      return this.replaceVariables(this.config.settings.disclaimer);
    },
    replaceVariables: function(string) {
      var pattern = /\[([a-zA-Z0-9_]+)\]/;
      var match;
      if (string != '') {
        while ((match = pattern.exec(string)) != null) {
          var replaced = false;
          var resultVariableMatch = this.resultVariableValues(match[1]);
          if (resultVariableMatch !== false) {
            string = string.replace(match[0], resultVariableMatch);
            replaced = true;
          }

          // If no replacement was found, break
          if (replaced == false) {
            break;
          }
        }
      }
      return string;
    },
    resultVariableValues: function(variable) {
      switch (variable) {
        case 'PayoutFrequency':
          return this.payoutFrequencies[this.results.PayoutFrequency];
      }
      if (typeof(this.results[variable]) !== 'undefined')
        return this.results[variable];
      else
        return false;
    },
    payoutFrequencies: {
      q: 'quarterly',
      a: 'annual',
      s: 'semiannual',
      m: 'monthly'
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
    mapWSGiftType: function(WSID) {
      var types = {
        g: 'ga',
        d: 'dga',
        a: 'crat',
        u: 'crut',
        l: 'clat',
        t: 'clut',
        p: 'pif',
        r: 'rle'
      };

      return types[WSID];
    },
    getTodaysDate: function() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      return mm + '/' + dd + '/' + yyyy;
    },
    getTodaysPlus3MoDate: function() {
      var today = new Date();
      today.setMonth(today.getMonth() + 3);
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      return mm + '/' + dd + '/' + yyyy;
    },
    getDeferredDate: function(yearsDeferred) {
      var today = new Date();
      var dd = today.getDate() + 1;
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = parseInt(today.getFullYear()) + parseInt(yearsDeferred);

      return mm + '/' + dd + '/' + yyyy;
    }
  };
})(jQuery1110);
