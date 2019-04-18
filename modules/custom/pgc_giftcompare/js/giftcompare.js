(function($) {
  PGC.apps.giftCompare = {
    $appContainer: null,
    $view: null,
    selectedGifts: [],
    comparisonData: [],
    giftLabels: {},
    comparisonLabels: {},
    init: function() {
      this.config = JSON.parse(this.config);
      this.$appContainer = $('#pgc-app');
      this.$appContainer.html(Mustache.render(this.config.templates.app, { 'cssIncludes': this.config.cssIncludes }));
      this.$view = $('#giftCompare');
      this.renderGiftOptionsView();
    },

    renderGiftOptionsView: function() {
      this.$view.html(Mustache.render(this.config.templates.gifttypes, { 'giftTypes': this.config.giftTypes }));
      this.bindGiftOptionsView();
    },

    bindGiftOptionsView: function() {
      var app = this;
      if(this.selectedGifts.length) {
        for(var i = 0; i < this.selectedGifts.length; i++) {
          var gift = this.selectedGifts[i];
          $('#'+gift).prop('checked', true);
        }
      }
      $(".giftOption").change(function() {
        if(this.checked) {
          if(app.selectedGifts.length <= 2)
            app.addGiftOption($(this).val())
          else {
            alert('Please select up to 3 gift options.\r\nDeselect a gift before adding another.');
            this.checked = false;
          }
        } else {
          app.removeGiftOption($(this).val());
        }
      });

      $('#compareBtn').click(function() {
        if(app.selectedGifts.length < 2) {
          alert('Please select at least 2 gifts to compare.');
        } else {
          app.renderComparisonView();
        }
      });

      // Add colors
      if(typeof(this.config.misc.btn_bg_color) != 'undefined') {
        this.$view.find('.gc-btn').css('background-color', this.config.misc.btn_bg_color);
      }
      if(typeof(this.config.misc.btn_color) != 'undefined') {
        this.$view.find('.gc-btn').css('color', this.config.misc.btn_color);
      }
      // #PGCS-842 - Starts
      if(this.config.misc.square_corners === "1") {
      	this.$view.find('.gc-btn').css('border-radius', '0px');
      } 
      // #PGCS-842 - Ends
    },

    addGiftOption: function(giftOption) {
      this.selectedGifts.push(giftOption);
    },

    removeGiftOption: function(giftOption) {
      var index = this.selectedGifts.indexOf(giftOption);
      if(index > -1) {
        this.selectedGifts.splice(index, 1);
      }
    },
    
    indexOf: function(){
    if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}},

    buildComparisonData: function() {
      this.comparisonData = [];
      var giftA = this.selectedGifts[0];
      var giftB = this.selectedGifts[1];
      if(this.selectedGifts.length == 3)
       var giftC = this.selectedGifts[2];

      for(var i = 0; i < this.config.giftFeatureLabels.length; i++) {
        var label = this.config.giftFeatureLabels[i].feature;
        var checkimg = '<img src="https://www.giftcalcs.com/sites/all/modules/custom/pgc_giftcompare/check-mark.png">';
        var giftBChecked = this.config.giftFeatures[giftB].indexOf(i) < 0 ? '' : checkimg;
        var giftAChecked = this.config.giftFeatures[giftA].indexOf(i) < 0 ? '' : checkimg;
        if(this.selectedGifts.length == 3)
         var giftCChecked = this.config.giftFeatures[giftC].indexOf(i) < 0 ? '&nbsp;' : checkimg;

        var row = {
          label: label,
          giftA: giftAChecked,
          giftB: giftBChecked
        };
        if(this.selectedGifts.length == 3)
          row.giftC = giftCChecked;

        this.comparisonData.push(row);

        var comparisonLabels = {};        
        var giftAlabel = this.getGiftLabel(this.selectedGifts[0]);
        if(this.getGiftLink(this.selectedGifts[0])!==''){
          // #GEP-66 - Starts here
          if(this.config.misc.giftcompare_link === "1") {
            giftAlabel = '<a href="'+this.getGiftLink(this.selectedGifts[0])+'">'+giftAlabel+'</a>';
          } 
          // #GEP-66 - Ends here         
        }
        comparisonLabels.giftA = giftAlabel;
        
        var giftBlabel = this.getGiftLabel(this.selectedGifts[1]);
        if(this.getGiftLink(this.selectedGifts[1])!==''){
          // #GEP-66 - Starts here
          if(this.config.misc.giftcompare_link === "1") {
            giftBlabel = '<a href="'+this.getGiftLink(this.selectedGifts[1])+'">'+giftBlabel+'</a>';
          }
          // #GEP-66 - Ends here
        }
        comparisonLabels.giftB = giftBlabel;
        
        if(this.selectedGifts.length == 3){
          var giftClabel = this.getGiftLabel(this.selectedGifts[2]);
          if(this.getGiftLink(this.selectedGifts[2])!==''){
          	// #GEP-66 - Starts here
          	if(this.config.misc.giftcompare_link === "1") {
              giftClabel = '<a href="'+this.getGiftLink(this.selectedGifts[2])+'">'+giftClabel+'</a>';
            }
            // #GEP-66 - Ends here
          }
          comparisonLabels.giftC = giftClabel;
        }
        
        /* // This code is commented and replaced by code above
        comparisonLabels.giftA = this.getGiftLabel(this.selectedGifts[0]);
        comparisonLabels.giftB = this.getGiftLabel(this.selectedGifts[1]);
        if(this.selectedGifts.length == 3)
          comparisonLabels.giftC = this.getGiftLabel(this.selectedGifts[2]);
        */
		// #GEP-66 - Ends here
        this.comparisonLabels = comparisonLabels;     
      }
    },

    getGiftLabel: function(abbr) {
      for(var i = 0; i < this.config.giftTypes.length; i++) {
        if(this.config.giftTypes[i].abbr == abbr)
          return this.config.giftTypes[i].label;
      }
    },
    
    // #GEP-66 - Starts Here
    getGiftLink: function(abbr) {
      for(var i = 0; i < this.config.giftTypes.length; i++) {
        if(this.config.giftTypes[i].abbr == abbr)
          return this.config.giftTypes[i].info_link;
      }
    },
    // #GEP-66 - Ends Here

    renderComparisonView: function() {
      this.buildComparisonData();
      this.$view.html(Mustache.render(this.config.templates.compare, {
        labels: this.comparisonLabels,
        features: this.comparisonData
      }));
      this.bindComparisonView();
    },

    bindComparisonView: function() {
      var app = this;
      $('#backBtn').click(function() {
        app.renderGiftOptionsView();
      });
      // Add colors
      if(typeof(this.config.misc.btn_bg_color) != 'undefined') {
        this.$view.find('.gc-btn').css('background-color', this.config.misc.btn_bg_color);
      }
      if(typeof(this.config.misc.btn_color) != 'undefined') {
        this.$view.find('.gc-btn').css('color', this.config.misc.btn_color);
      }
      // #PGCS-842 - Starts
      if(this.config.misc.square_corners === "1") {
      	this.$view.find('.gc-btn').css('border-radius', '0px');
      } 
      // #PGCS-842 - Ends
    }

  };
})(jQuery1110);