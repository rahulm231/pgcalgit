(function($) {
  PGC.apps.giftGuide.steps = [];

  PGC.apps.giftGuide.qanda = function() {
    this.steps[0] = {
      type: "question",
      text: "When would you like to make your gift?",
      answers: [
      {
        text: "Now, or in the near future",
        note: "Earn immediate tax benefits, do income or estate planning now",
        nextStep: 1
      },
      {
        text: "Upon my death",
        note: "Save estate taxes, benefit your heirs, learn estate planning tips",
        nextStep: 2
      }
      ]
    };
    this.steps[1] = {
      type: "question",
      text: "In addition to supporting CHARITY_NAME, what is the primary goal for your gift?",
      answers: [
      {
        text: "Maximize my immediate income tax benefit",
        note: "",
        nextStep: 3
      },
      {
        text: "Maintain or increase my income",
        note: "",
        nextStep: 4
      },
      {
        text: "Give non-cash assets",
        note: "For example, securities, real estate, or retirement plan assets",
        nextStep: 5
      },
      {
        text: "Preserve assets for my heirs",
        note: "",
        nextStep: 6
      }
      ]
    };
    this.steps[2] = {
      type: "question",
      text: "In addition to supporting CHARITY_NAME, what are your goals for your gift?",
      answers: [
      {
        text: "Maximize my estate's tax benefits",
        note: "",
        nextStep: 30
      },
      {
        text: "Provide income payments to my heirs",
        note: "",
        nextStep: 31
      },
      {
        text: "Give non-cash assets",
        note: "For example, securities, life insurance, or retirement plan assets",
        nextStep: 32
      },
      {
        text: "Preserve assets for my heirs",
        note: "",
        nextStep: 33
      }
      ]
    };
    this.steps[3] = {
      type: "result",
      text: "og"
    };
    this.steps[4] = {
      type: "question",
      text: "When would you like your payments to start?",
      answers: [
      {
        text: "Immediately",
        note: "Potentially increase your income",
        nextStep: 7
      },
      {
        text: "A year or more from now",
        note: "Supplement your income later, for example during retirement",
        nextStep: 8
      }
      ]
    };
    this.steps[5] = {
      type: "question",
      text: "What kind of gift would you like to consider?",
      answers: [
      {
        text: "Give publicly-traded securities",
        note: "",
        nextStep: 21
      },
      {
        text: "Give my home but keep living in it as long as I want",
        note: "",
        nextStep: 22
      },
      {
        text: "Give other real estate",
        note: "",
        nextStep: 23
      },
      {
        text: "Sell an asset to us at a bargain price",
        note: "Receive immediate cash and tax benefits",
        nextStep: 24
      },
      {
        text: "Give a life insurance policy I no longer need",
        note: "",
        nextStep: 25
      },
      {
        text: "Give my IRA or other retirement plan assets I no longer need",
        note: "",
        nextStep: 26
      },
      {
        text: "Give personal property",
        note: "Collectibles, such as artwork, stamps, antiques, or other property of value",
        nextStep: 27
      }
      ]
    };
    this.steps[6] = {
      type: "question",
      text: "How would you prefer to pass on assets?",
      answers: [
      {
        text: "All asset growth to heirs; fixed payments to CHARITY_NAME",
        note: "Often best for passing assets to children",
        nextStep: 28
      },
      {
        text: "Asset growth shared by heirs and CHARITY_NAME; variable payments to CHARITY_NAME",
        note: "Often best for passing assets to grandchildren",
        nextStep: 29
      }
      ]
    };
    this.steps[7] = {
      type: "question",
      text: "I prefer payments that ...",
      answers: [
      {
        text: "Will be the same amount each year",
        note: "Enjoy the security of knowing how much you will get each year",
        nextStep: 9
      },
      {
        text: "May vary each year",
        note: "Payments may grow, offering a hedge against inflation",
        nextStep: 10
      }
      ]
    };
    this.steps[8] = {
      type: "question",
      text: "I prefer payments that ...",
      answers: [
      {
        text: "Will be the same amount each year",
        note: "Enjoy the security of knowing how much you will get each year",
        nextStep: 19
      },
      {
        text: "May vary each year",
        note: "Payments may grow, offering a hedge against inflation",
        nextStep: 20
      }
      ]
    };
    this.steps[9] = {
      type: "question",
      text: "How much would you consider giving?",
      answers: [
      {
        text: "CGA_CRT_RANGE",
        note: "",
        nextStep: 11
      },
      {
        text: "Over CGA_CRT_OVER",
        note: "",
        nextStep: 12
      }
      ]
    };
    this.steps[10] = {
      type: "question",
      text: "How much would you consider giving?",
      answers: [
      {
        text: "PIF_CRU_RANGE",
        note: "",
        nextStep: 15
      },
      {
        text: "over PIF_CRU_OVER",
        note: "",
        nextStep: 16
      }
      ]
    };
    this.steps[11] = {
      type: "result",
      text: "ga"
    };
    this.steps[12] = {
      type: "question",
      text: "Which kind of gift would you prefer?",
      answers: [
      {
        text: "A simple arrangement managed by CHARITY_NAME",
        note: "",
        nextStep: 13
      },
      {
        text: "A flexible arrangement managed by the trustee(s) I choose",
        note: "",
        nextStep: 14
      }
      ]
    };
    this.steps[13] = {
      type: "result",
      text: "ga"
    };
    this.steps[14] = {
      type: "result",
      text: "crat"
    };
    this.steps[15] = {
      type: "result",
      text: "pif"
    };
    this.steps[16] = {
      type: "question",
      text: "Which kind of gift would you prefer?",
      answers: [
      {
        text: "A simple arrangement managed by CHARITY_NAME",
        note: "",
        nextStep: 17
      },
      {
        text: "A flexible arrangement managed by the trustee(s) I choose",
        note: "",
        nextStep: 18
      }
      ]
    };
    this.steps[17] = {
      type: "result",
      text: "pif"
    };
    this.steps[18] = {
      type: "result",
      text: "crut"
    };
    this.steps[19] = {
      type: "result",
      text: "dga"
    };
    this.steps[20] = {
      type: "result",
      text: "cfu"
    };
    this.steps[21] = {
      type: "result",
      text: "pts"
    };
    this.steps[22] = {
      type: "result",
      text: "rle"
    };
    this.steps[23] = {
      type: "result",
      text: "re"
    };
    this.steps[24] = {
      type: "result",
      text: "bs"
    };
    this.steps[25] = {
      type: "result",
      text: "li"
    };
    this.steps[26] = {
      type: "result",
      text: "rpa"
    };
    this.steps[27] = {
      type: "result",
      text: "co"
    };
    this.steps[28] = {
      type: "result",
      text: "clat"
    };
    this.steps[29] = {
      type: "result",
      text: "clut"
    };
    this.steps[30] = {
      type: "result",
      text: "bqt"
    };
    this.steps[31] = {
      type: "question",
      text: "I prefer payments that ...",
      answers: [
      {
        text: "Will be the same amount each year",
        note: "Enjoy the security of knowing how much you will get each year",
        nextStep: 34
      },
      {
        text: "May vary each year",
        note: "Payments may grow, offering a hedge against inflation",
        nextStep: 35
      }
      ]
    };
    this.steps[32] = {
      type: "question",
      text: "What kind of gift would you like to consider?",
      answers: [
      {
        text: "Proceeds from a life insurance policy",
        note: "",
        nextStep: 44
      },
      {
        text: "My IRA or other retirement plan assets",
        note: "",
        nextStep: 45
      },
      {
        text: "Real estate",
        note: "",
        nextStep: 46
      },
      {
        text: "Collectibles or other personal property",
        note: "",
        nextStep: 47
      }
      ]
    };
    this.steps[33] = {
      type: "question",
      text: "How would you prefer to pass on assets?",
      answers: [
      {
        text: "All asset growth to heirs; fixed payments to CHARITY_NAME",
        note: "Often best for passing assets to children",
        nextStep: 48
      },
      {
        text: "Asset growth shared by heirs and CHARITY_NAME; variable payments to CHARITY_NAME",
        note: "Often best for passing assets to grandchildren",
        nextStep: 49
      }
      ]
    };
    this.steps[34] = {
      type: "question",
      text: "How much would you consider giving?",
      answers: [
      {
        text: "CGA_CRT_RANGE",
        note: "",
        nextStep: 36
      },
      {
        text: "Over CGA_CRT_OVER",
        note: "",
        nextStep: 37
      }
      ]
    };
    this.steps[35] = {
      type: "question",
      text: "How much would you consider giving?",
      answers: [
      {
        text: "PIF_CRU_RANGE",
        note: "",
        nextStep: 40
      },
      {
        text: "over PIF_CRU_OVER",
        note: "",
        nextStep: 41
      }
      ]
    };
    this.steps[36] = {
      type: "result",
      text: "ga"
    };
    this.steps[37] = {
      type: "question",
      text: "Which kind of gift would you prefer?",
      answers: [
      {
        text: "A simple arrangement managed by CHARITY_NAME",
        note: "",
        nextStep: 38
      },
      {
        text: "A flexible arrangement managed by the trustee(s) I choose",
        note: "",
        nextStep: 39
      }
      ]
    };
    this.steps[38] = {
      type: "result",
      text: "ga"
    };
    this.steps[39] = {
      type: "result",
      text: "crat"
    };
    this.steps[40] = {
      type: "result",
      text: "pif"
    };
    this.steps[41] = {
      type: "question",
      text: "Which kind of gift would you prefer?",
      answers: [
      {
        text: "A simple arrangement managed by CHARITY_NAME",
        note: "",
        nextStep: 42
      },
      {
        text: "A flexible arrangement managed by the trustee(s) I choose",
        note: "",
        nextStep: 43
      }
      ]
    };
    this.steps[42] = {
      type: "result",
      text: "pif"
    };
    this.steps[43] = {
      type: "result",
      text: "crut"
    };
    this.steps[44] = {
      type: "result",
      text: "li"
    };
    this.steps[45] = {
      type: "result",
      text: "rpa"
    };
    this.steps[46] = {
      type: "result",
      text: "re"
    };
    this.steps[47] = {
      type: "result",
      text: "co"
    };
    this.steps[48] = {
      type: "result",
      text: "clat"
    };
    this.steps[49] = {
      type: "result",
      text: "clut"
    };
  };

  PGC.apps.giftGuide.pruneTree = function(stepId) {
    var step = PGC.apps.giftGuide.steps[stepId];
    // If we're at a result, enable/disable it according
    // to the enabledGifts variable
    if(step.type == 'result') {
      for(var i = 0; i < PGC.apps.giftGuide.enabledGifts.length; i++) {
        if(step.text == PGC.apps.giftGuide.enabledGifts[i])
          return true;
      }
      // no matches
      return false;
    }
    // If at a question, recurse until reaching a result,
    // then disable answers which lead to a disabled result.
    else {
      // Keep a count of how many answers we've disabled
      // so we can skip this question if only one remains
      var numDisabled = 0;
      // Hold on to an enabled answer's nextStep so that if only
      // one remains at the end, we can use that as the
      // next question
      var skipTo = null;
      // Inspect each answer
      for(var i = 0; i < step.answers.length; i++) {
        // Recursive function which walks down the tree
        if(PGC.apps.giftGuide.pruneTree(step.answers[i].nextStep)) {
          // We have an enabled result, set a flag on it
          PGC.apps.giftGuide.steps[stepId].answers[i].enabled = true;
          // Store this enabled step (used if only one remains)
          skipTo = step.answers[i].nextStep;
        }
        else {
          // Disable this answer
          PGC.apps.giftGuide.steps[stepId].answers[i].enabled = false;
          numDisabled++;
        }
      }
      // Skip this step if only one answer remains
      if(step.answers.length - numDisabled == 1) {
        PGC.apps.giftGuide.steps[stepId].skip = true;
        PGC.apps.giftGuide.steps[stepId].skipTo = skipTo;
      }
      // If no answers remain, disable this question
      return numDisabled < step.answers.length;
    }
  };

  // Replace text function (global)
  PGC.apps.giftGuide.replaceText = function(find, replace, str) {
    return str.replace(new RegExp(find, "g"), replace);
  };

  // Iterate through steps and replace placeholder text with replacement text
  // using replaceText function above
  PGC.apps.giftGuide.process_text = function (step){
    switch(step.type){
      case 'result':
        $.each(PGC.apps.giftGuide.replace_patterns, function(index, pattern){
          step.text = PGC.apps.giftGuide.replaceText(pattern[0], pattern[1], step.text);
        });
        break;
      case 'question':
        $.each(PGC.apps.giftGuide.replace_patterns, function(index, pattern){
          step.text = PGC.apps.giftGuide.replaceText(pattern[0], pattern[1], step.text);
          $.each(step.answers, function(index, value) {
            step.answers[index].text = PGC.apps.giftGuide.replaceText(pattern[0], pattern[1], step.answers[index].text);
            step.answers[index].note = PGC.apps.giftGuide.replaceText(pattern[0], pattern[1], step.answers[index].note);
          });
        });
        break;
    }
    return step;
  };

  PGC.apps.giftGuide.previousSteps = [];
  PGC.apps.giftGuide.displayStep = function(stepId) {
    var output = '';
    var currentStep = PGC.apps.giftGuide.process_text(PGC.apps.giftGuide.steps[stepId]);
    // Check whether this step can be skipped (if it only has one active answer)
    if(currentStep.skip) {
      return PGC.apps.giftGuide.displayStep(currentStep.skipTo);
    }
    // If the current step is a question, display the QA form
    if(currentStep.type == 'question') {
      output += '<div class="header-text">'+currentStep.text+'</div>';
      output += '<form id="answerForm">';
      // Output each of the answers as a radio button
      for(var i = 0; i < currentStep.answers.length; i++) {
        if(currentStep.answers[i].enabled) {
          output += '<input type="radio" name="answer" id="radio_'+i+'" value="'+currentStep.answers[i].nextStep+'"> ';
          output += '<label id="radio_label_'+i+'" class="choices" for="radio_'+i+'">'+currentStep.answers[i].text+'</label><br />';
          //check for note text
          if(currentStep.answers[i].note !== "") {
            output +='<div class=\"note\">'+currentStep.answers[i].note+'</div><br />';
          }
        }
      }
      output += '<div class="error"></div>';
      // if there are no previous steps and you are not at the start point
      if(PGC.apps.giftGuide.previousSteps.length && stepId !== 0) {
        output += '<input type="button" class="gg-btn-reset" id="Reset" value="Reset" />';
        output += '<input type="button" class="gg-btn-back" id="Back" value="Back" />';
      }
      output += '<input type="button" class="gg-btn-submit" id="submitAnswer" value="Continue" data-step-id="'+stepId+'" />';
      output += '</form>';
    }

    // If the current step is a result, display its text
    else if(currentStep.type == 'result') {
      output += 'Based on your preferences, the following gift plan could be right for you:';
      output += '<br /><br /><div class=\"result\"><div class="header-text">'+this.config.gifttype_labels[currentStep.text]+'</div></div>';
      output += '<br /><br /><a href="'+this.config.infoLinks[currentStep.text]+'">Learn more &raquo;</a><br /><br />';
      output += '<input type="button" class="gg-btn-reset" id="Reset" value="Reset" />';
      output += '<input type="button" class="gg-btn-back" id="Back" value="Back" />';
    }

    // Output the form
    $('#giftGuide').html(output);
    // Update the indicator
    PGC.apps.giftGuide.updateIndicator(stepId);
    // Colorize with custom colors
    PGC.apps.giftGuide.colorize();
  };

  PGC.apps.giftGuide.updateIndicator = function(stepId) {
    if(stepId == 0) {
      $('.gg-step.active').removeClass('active');
      $('.gg-one').addClass('active');
    }
    else if(PGC.apps.giftGuide.steps[stepId].type == 'question') {
      $('.gg-step.active').removeClass('active');
      $('.gg-two').addClass('active');
    } else {
      $('.gg-step.active').removeClass('active');
      $('.gg-three').addClass('active');
    }

  }

  PGC.apps.giftGuide.colorize = function() {
    var colors = this.config.misc;
    console.log(colors);

    $('.gg-btn-submit').css('background-color', colors.btn_highlight_color).css('color', colors.btn_base_color);
    $('.gg-btn-back').css('background-color', colors.btn_base_color).css('color', colors.btn_highlight_color);
    $('.gg-btn-reset').css('color', colors.btn_highlight_color);
    // #PGCS-842 - Starts here
    if(colors.btn_square_corners === "1") {
      $('.gg-btn-submit').css('border-radius', '0px');
      $('.gg-btn-back').css('border-radius', '0px');
    } 
    // #PGCS-842 - Ends here

    $('.gg-step-bubble').css('color', colors.ind_fg_inactive).css('background-color', colors.ind_bg_inactive).css('border', '1px solid '+colors.ind_fg_inactive);
    $('.gg-step-label').css('color', colors.ind_text_inactive);
    $('.gg-step.active .gg-step-bubble').css('color', colors.ind_fg_active).css('background-color', colors.ind_bg_active).css('border', '1px solid '+colors.ind_fg_active);
    $('.gg-step.active .gg-step-label').css('color', colors.ind_text_active);
    $('.gg-step-line').css('background-color', colors.ind_bg_active);
    // #PGCS-842 - Starts here
    if(colors.ind_square_corners === "1") {
      $('.gg-step-bubble').css('border-radius', '0px');
    } 
    // #PGCS-842 - Ends here
  };


  // Applies $ formatting to variables (excluding charity name)
  PGC.apps.giftGuide.formatVariables = function() {
    for(var i = 1; i <= 4; i++) {
      PGC.apps.giftGuide.replace_patterns[i][1] = '$' + this.addCommas(parseInt(PGC.apps.giftGuide.replace_patterns[i][1]).toFixed(2));
    }
  };

  PGC.apps.giftGuide.addCommas = function(n) {
    var rx=  /(\d+)(\d{3})/;
    return String(n).replace(/^\d+/, function(w){
      while(rx.test(w)){
        w= w.replace(rx, '$1,$2');
      }
      return w;
    });
  };
//CGA_MINIMUM - CRT_MINIMUM
  PGC.apps.giftGuide.addRangeVariables = function() {
    var len = this.replace_patterns.length;
    for(var i = 0; i < len; i++) {
      if(this.replace_patterns[i][0] == 'CRT_MINIMUM') {
        var crt_minimum = this.replace_patterns[i][1];
      } else if(this.replace_patterns[i][0] == 'CGA_MINIMUM') {
        var cga_minimum = this.replace_patterns[i][1];
      } else if(this.replace_patterns[i][0] == 'PIF_MINIMUM') {
        var pif_minimum = this.replace_patterns[i][1];
      } else if(this.replace_patterns[i][0] == 'CRU_MINIMUM') {
        var cru_minimum = this.replace_patterns[i][1];
      }
    }
    var crt_min_formatted = '$' + this.addCommas(parseInt(crt_minimum).toFixed(2));
    var cga_min_formatted = '$' + this.addCommas(parseInt(cga_minimum).toFixed(2));
    var pif_min_formatted = '$' + this.addCommas(parseInt(pif_minimum).toFixed(2));
    var cru_min_formatted = '$' + this.addCommas(parseInt(cru_minimum).toFixed(2));

    if(parseInt(crt_minimum) > parseInt(cga_minimum)) {
      this.replace_patterns.push(
        ['CGA_CRT_RANGE', cga_min_formatted + ' - ' + crt_min_formatted]);
      this.replace_patterns.push(
        ['CGA_CRT_OVER', crt_min_formatted]);
    }
    else {
      this.replace_patterns.push(
        ['CGA_CRT_RANGE', crt_min_formatted + ' - ' + cga_min_formatted]);
      this.replace_patterns.push(
        ['CGA_CRT_OVER', cga_min_formatted]);
    }

    if(parseInt(pif_minimum) > parseInt(crt_minimum)) {
      this.replace_patterns.push(
        ['PIF_CRT_RANGE', crt_min_formatted + ' - ' + pif_min_formatted]);
      this.replace_patterns.push(
        ['PIF_CRT_OVER', pif_min_formatted]);
    }
    else {
      this.replace_patterns.push(
        ['PIF_CRT_RANGE', pif_min_formatted + ' - ' + crt_min_formatted]);
      this.replace_patterns.push(
        ['PIF_CRT_OVER', crt_min_formatted]);
    }

    if(parseInt(pif_minimum) > parseInt(cru_minimum)) {
      this.replace_patterns.push(
        ['PIF_CRU_RANGE', cru_min_formatted + ' - ' + pif_min_formatted]);
      this.replace_patterns.push(
        ['PIF_CRU_OVER', pif_min_formatted]);
    }
    else {
      this.replace_patterns.push(
        ['PIF_CRU_RANGE', pif_min_formatted + ' - ' + cru_min_formatted]);
      this.replace_patterns.push(
        ['PIF_CRU_OVER', cru_min_formatted]);
    }
  };

  PGC.apps.giftGuide.init = function() {
    this.enabledGifts = PGC.config.enabledGifts;
    this.config = $.parseJSON(this.config);
    this.qanda();
    this.replace_patterns = this.config.variables;
    this.addRangeVariables();
    this.formatVariables();
    var appContainer = Mustache.render(this.config.templates.app, this.config);
    this.$app = $('#pgc-app');
    this.$app.html(appContainer);
    PGC.apps.giftGuide.pruneTree(0);
    // display the first step when the page is loaded
    PGC.apps.giftGuide.displayStep(0);
    // Bind the answer submission button click to the document,
    // because it will be re-rendered for each question
    $(document).on('click', '#giftGuide #submitAnswer', function() {
      var nextStep = $('#answerForm input[name=answer]:checked').val();
      var thisStep = $(this).data('step-id');
      PGC.apps.giftGuide.previousSteps.push(thisStep);
      // Ensure we got an answer, if not, display an error
      if(isNaN(nextStep)) {
        $('#giftGuide #answerForm .error').html('Please select an answer');
      }
      // Display the next step
      else {
        PGC.apps.giftGuide.displayStep(nextStep);
      }
    });
    $(document).on('click', '#giftGuide #Back', function() {
      var previousStep = PGC.apps.giftGuide.previousSteps.pop();
      // Ensure we have a previous answer, if not display an error
      if(isNaN(previousStep)) {
        $('#answerForm .error').html('Can\'t go back!');
      }
      // Display the previous step
      else {
        PGC.apps.giftGuide.displayStep(previousStep);
      }
    });

    // Reset
    $(document).on('click', '#giftGuide #Reset', function() {
      PGC.apps.giftGuide.displayStep(0);
    });
  }
})(jQuery1110);
