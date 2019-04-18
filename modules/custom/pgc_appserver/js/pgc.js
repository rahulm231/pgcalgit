var jQuery1110 = jQuery.noConflict( true );
var PGC = {};
(function($) {
  PGC = {
    apps: {},
    tabs: [],
    $app: null,
    init: function() {
      this.config = JSON.parse(this.config);
      // Build the tabs, if enabled
      if(this.config.show_tabs === true) {
        for(var app in this.apps) {
          this.tabs.push({'app': app, 'appTitle': this.apps[app].title });
        }
        this.tabs[0].active = "pgc-tab-active";
      }
      // Render the app container
      var appContainer = Mustache.render(this.config.templates.app, { 'tabs': this.tabs, 'cssIncludes': this.config.cssIncludes, 'server': this.config.server });
      this.$app = $('#pgc-app-container');
      this.$app.html(appContainer);
      // Initialize the active app
      for(var app in this.apps){
        if(this.apps.hasOwnProperty(app)) {
          this.apps[app].init();
          break;
        }
      }
      // Apply tab colors, if enabled
      if(this.config.show_tabs === true) {
        // Set the tab colors
        var $allTabs = $('.pgc-tab');
        var $activeTab = $('.pgc-tab-active');
        $allTabs.css('color', this.config.misc.tab_color);
        $allTabs.css('background-color', this.config.misc.tab_bg_color);
        $activeTab.css('color', this.config.misc.tab_color_active);
        $activeTab.css('background-color', this.config.misc.tab_bg_color_active);
        
        //#PGCS-639 - Starts
        $activeTab.css('cursor', 'pointer');
      }
      
      // #PGCS-639 - Starts
      $('.pgc-tab-active').click(function(e){ 
      	  $('.gc-btn-customize').click();	
      	  $('#gc-customize-cancel').click();
      });
      // #PGCS-639 - Ends
      
      // #GEP-53 - Starts
      if(this.config.square_corners === "1") {
      	$allTabs.css('border-radius', '0px');
        $('#pgc-app').css('border-radius', '0px');
      } 
      // #GEP-53 - Ends
      
      // #GEP-54 - Starts
      if(this.config.remove_border === "1") {
        $('#pgc-app').css('border', 'none');
      } 
      // #GEP-54 - Ends
    },

   in_array: function(needle, haystack) {
      for(var i in haystack) {
        if(haystack[i] == needle) return true;
      }
      return false;
    },

    dates: {
      day_tab: [
        [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      ],

      actuarialAge: function(fromYear, fromMonth, fromDay, toYear, toMonth, toDay) {
        var fromDate, toDate, age;

        fromDate = this.daysInYear(fromYear, fromMonth, fromDay);
        toDate = this.daysInYear(toYear, toMonth, toDay);

        if((toYear < fromYear) || ((toYear == fromYear) && (toDate < fromDate))) {
          return false;
        }

        age = toYear - fromYear;

        if((fromMonth < toMonth) || ((fromMonth == toMonth) && (fromDay < toDay))) {
          if(this.days(toYear, fromMonth, fromDay, toYear, toMonth, toDay) >
            this.days(toYear, toMonth, toDay, toYear + 1, fromMonth, fromDay)) {
            age++;
          }
        } else {
          if(this.days(toYear, toMonth, toDay, toYear, fromMonth, fromDay) >
            this.days(toYear - 1, fromMonth, fromDay, toYear, toMonth, toDay)) {
            age--;
          }
        }

        return age;
      },

      isLeap: function(year) {
        return year%4 && year%100 != 0 || year%400 == 0 ? 1 : 0;
      },

      daysInYear: function(year, month, day) {
        for (var i = 1; i < month; i++)
          day += this.day_tab[this.isLeap(year)][i];
        return (day);
      },

      days: function(year1, month1, day1, year2, month2, day2) {
        var age;

        if(year2 == year1)
          age = this.daysInYear(year2, month2, day2) - this.daysInYear(year1, month1, day1);
        else {
          if(year1 < year2) {
            /* days for first partial year */
            age = this.daysInYear(year1, 12, 31) - this.daysInYear(year1, month1, day1);
            /* days for last partial year */
            age += this.daysInYear(year2, month2, day2);
            /* days for full years in between */
            age += (year2 - year1 - 1) * 365;
            for(var i = year1 + 1; i < year2; i++) {
              age += this.isLeap(i);
            }
          } else {
            /* days for first partial year */
            age = this.daysInYear(year2, 12, 31) - this.daysInYear(year2, month2, day2);
            /* days for last partial year */
            age += this.daysInYear(year1, month1, day1);
            /* days for full years in between */
            age += (year1 - year2 - 1) * 365;
            for(var i = year2 + 1; i < year1; i++) {
              age += this.isLeap(i);
            }
            age--;
          }
        }
        return age;
      }
    }
  };
})(jQuery1110);
