(function ($) {
  $(document).ready(function () {

    $("tbody").find("td").each(function(){
        var th = $(this).closest('table').find('th').eq($(this).index());
        var column = $(th).text();

        if ($.inArray(column,
	        ['GiftDate',
		 'GiftAmount',
		 'CostBasis',
		 'Age1',
		 'Age2',
		 'PaymentRate',
		 'AnnualPayment',
		 'FirstYearIncome',
		 'TaxFreePortion',
		 'CharitableDeduction',
		 'IRSDiscountRate',
		 'BuildingValue',
		 'CalculationDate',
		 'LogDate']) > -1){
            $(this).css("text-align", "right");
        }

	if (column == "LogDate"){
		$(this).css("min-width", "80px");
	}

        if ($.inArray(column,
			['Addr1',
			'Addr2',
			'ZIP',
			'Phone']) > -1){
				$(this).css("white-space", "nowrap");
			}

    });
    
    // #GEP-2 - starts
    
    var result = [];
    $('table#summary tr').each(function(){
      $('td', this).each(function(index, val){      	
        if(!result[index]){
          result[index] = 0;
        }        
        if(index===0){
          result[index] = "TOTALS";	
        }else{
          value = $(val).text();
          value = value.replace(/,/g, '');
          value = value.replace(/\$/g, '');
          result[index] += parseFloat(value);
        }          
      });
    });

    $('table#summary').append('<tfoot><tr></tr></tfoot>');
    $(result).each(function(index, val){
      var subtotals = this;      
      if(index >= 2){
      	subtotals = subtotals.valueOf();
      	subtotals = parseFloat(subtotals).toFixed(2);
      	subtotals = subtotals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        subtotals = "<th>$"+subtotals+"</th>";	
      }else{
      	subtotals = "<th class='leftAlign'>"+subtotals+"</th>"
      }
      $('table#summary tfoot tr').last().append(subtotals);
    });
    
    
    
    /*
    if (typeof Drupal.settings.query_string_params.number_entries != 'undefined' &&
        !isNaN(parseFloat(Drupal.settings.query_string_params.number_entries))
        && isFinite(Drupal.settings.query_string_params.number_entries)) {
        pageLength = Drupal.settings.query_string_params.number_entries;
    }
    else {
      pageLength = 10;      
    }
    */
    if (typeof Drupal.settings.query_string_params.number_entries != 'undefined' &&
        !isNaN(parseFloat(Drupal.settings.query_string_params.number_entries))
        && isFinite(Drupal.settings.query_string_params.number_entries)) {
        pageLength = Drupal.settings.query_string_params.number_entries;
    }else if(Drupal.settings.report_type=='summary'){
      pageLength = 25; 	
    }
    else {
      pageLength = 10;      
    }

  
    //oSettings._iDisplayLength = number_entries;
    if ($("#summary").length > 0) {
      $('#summary').DataTable({
        "dom": 'BT<"clear">rtip',
        /*
        buttons: [
            'csv',
            'print'
        ],*/

buttons: [
         {
            extend: 'csv',
            footer: true
         },
         {
            extend: 'print',
            footer: true,
            customize: function (win){
        $(win.document.body).find('table thead th').css('text-align', 'right');
        $(win.document.body).find('table thead th').css('font-family', 'sans-serif');
        $(win.document.body).find('table tbody td').css('text-align', 'right');
        $(win.document.body).find('.fixedHeader.dataTable tfoot th').css('text-align', 'right');
        $(win.document.body).find('table tbody td').css('font-family', 'sans-serif');
        $(win.document.body).find('.fixedHeader.dataTable tfoot th').css('font-family', 'sans-serif');
        $(win.document.body).find('body h1').css('font-family', 'sans-serif !important;');
        $(win.document.body).find('.fixedHeader.dataTable tfoot th').css({"position": "relative", "left": "8px"});
      },

          },
       ],
       "colVis": {
         "buttonText": "Change columns",
       },

      });
    }
    // #GEP-2 - ends
    
    if ($("#details").length > 0) {
      $('#gift-date-from').datepicker({dateFormat: 'mm/dd/yy'});
      $('#gift-date-to').datepicker({dateFormat: 'mm/dd/yy'});
      $('#calculation-dates-from').datepicker({dateFormat: 'mm/dd/yy'});
      $('#calculation-dates-to').datepicker({dateFormat: 'mm/dd/yy'});

      gift_types = {};
      $('#details td:nth-child(2)').each(function(){
        gift_types[$(this).text()] = $(this).text();
      });

      // Add empty option element.
      $('#edit-gift-types').append($("<option></option>").attr("value", '').text('<none>'));
      // Add all values from the table.
      $.each(gift_types, function(key, value) {
        $('#edit-gift-types').append($("<option></option>").attr("value", value).text(value));
      });

      $('#details').DataTable({
        "pageLength": parseInt(pageLength),
        "dom": 'BT<"clear">rtip',
        buttons: [
            'csv',
            {
              extend: 'print',
                customize: function (win){
            $(win.document.body).find('table tbody td').css('text-align', 'right');
            $(win.document.body).find('table tbody td').css('font-family', 'sans-serif');
            $(win.document.body).find('body h1').css('font-family', 'sans-serif !important;');
            $(win.document.body).find('.fixedHeader.dataTable thead th').css('font-family', 'sans-serif');
      },
            }
        ],
        "colVis": {
          "buttonText": "Change columns",
        },
        initComplete: function () {
          var api = this.api();

          api.columns().indexes().flatten().each(function (i) {
            var column = api.column(i);
            var select = $('<select><option value=""></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                      var val = $.fn.dataTable.util.escapeRegex(
                              $(this).val()
                              );

                      column
                              .search(val ? '^' + val + '$' : '', true, false)
                              .draw();
                    });

            column.data().unique().sort().each(function (d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
        },
      });
    }
  });
})(jQuery);

jQuery.noConflict(true);
