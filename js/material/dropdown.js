(function ($) {
  $(document).ready(function() {

    // Text based inputs
    var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

    // Add active if form auto complete
    $(document).on('change', input_selector, function () {
      if($(this).val().length !== 0) {
        $(this).siblings('label, i').addClass('active');
      }
      validate_field($(this));
    });

    // Add active if input element has been pre-populated on document ready
    $(document).ready(function() {
      $(input_selector).each(function(index, element) {
        if($(element).val().length > 0) {
          $(this).siblings('label, i').addClass('active');
        }
      });
    });

    // HTML DOM FORM RESET handling
    $(document).on('reset', function(e) {
      if ($(e.target).is('form')) {
        $(this).find(input_selector).removeClass('valid').removeClass('invalid');

        // Reset select
        $(this).find('select.initialized').each(function () {
          var reset_text = $(this).find('option[selected]').text();
          $(this).siblings('input.select-dropdown').val(reset_text);
        });
      }
    });

    // Add active when element has focus
    $(document).on('focus', input_selector, function () {
      $(this).siblings('label, i').addClass('active');
    });

    $(document).on('blur', input_selector, function () {
      if ($(this).val().length === 0) {
        $(this).siblings('label, i').removeClass('active');
      }
      validate_field($(this));
    });

    validate_field = function(object) {
      if (object.val().length === 0) {
        if (object.hasClass('validate')) {
          object.removeClass('valid');
          object.removeClass('invalid');
        }
      }
      else {
        if (object.hasClass('validate')) {
          if (object.is(':valid')) {
            object.removeClass('invalid');
            object.addClass('valid');
          }
          else {
            object.removeClass('valid');
            object.addClass('invalid');
          }
        }
      }
    }


    // Textarea Auto Resize
    if ($('.hiddendiv').length === 0) {
      var hiddenDiv = $('<div class="hiddendiv common"></div>'),
        content = null;
        $('body').append(hiddenDiv);
    }
    var text_area_selector = '.materialize-textarea';
    $('.hiddendiv').css('width', $(text_area_selector).width());

    $(text_area_selector).each(function () {
      if ($(this).val().length) {
        content = $(this).val();
        content = content.replace(/\n/g, '<br>');
        hiddenDiv.html(content + '<br>');
        $(this).css('height', hiddenDiv.height());
      }
    });
      $('body').on('keyup keydown',text_area_selector , function () {
        content = $(this).val();
        content = content.replace(/\n/g, '<br>');
        hiddenDiv.html(content + '<br>');
        $(this).css('height', hiddenDiv.height());
      });


    // File Input Path
    $('.file-field').each(function() {
      var path_input = $(this).find('input.file-path');
      $(this).find('input[type="file"]').change(function () {
        path_input.val($(this).val());
        path_input.trigger('change');
      });
    });


    // Range Input
    var range_type = 'input[type=range]';
    var range_mousedown = false;

    $(range_type).each(function () {
      var thumb = $('<span class="thumb"><span class="value"></span></span>');
      $(this).after(thumb);
    });

    var range_wrapper = '.range-field';

      $(document).on("mousedown", range_wrapper, function(e) {
        var thumb = $(this).children('.thumb');
        if (thumb.length <= 0) {
          thumb = $('<span class="thumb"><span class="value"></span></span>');
          $(this).append(thumb);
        }

      range_mousedown = true;
      $(this).addClass('active');

      if (!thumb.hasClass('active')) {
        thumb.velocity({ height: "30px", width: "30px", top: "-20px", marginLeft: "-15px"}, { duration: 300, easing: 'easeOutExpo' });
      }
      var left = e.pageX - $(this).offset().left;
      var width = $(this).outerWidth();

      if (left < 0) {
        left = 0;
      }
      else if (left > width) {
        left = width;
      }
      thumb.addClass('active').css('left', left);
      thumb.find('.value').html($(this).children('input[type=range]').val());

    });
    $(document).on("mouseup", range_wrapper, function() {
      range_mousedown = false;
      $(this).removeClass('active');
    });

    $(document).on("mousemove", range_wrapper, function(e) {

      var thumb = $(this).children('.thumb');
      if (range_mousedown) {
        if (!thumb.hasClass('active')) {
          thumb.velocity({ height: "30px", width: "30px", top: "-20px", marginLeft: "-15px"}, { duration: 300, easing: 'easeOutExpo' });
        }
        var left = e.pageX - $(this).offset().left;
        var width = $(this).outerWidth();

        if (left < 0) {
          left = 0;
        }
        else if (left > width) {
          left = width;
        }
        thumb.addClass('active').css('left', left);
        thumb.find('.value').html($(this).children('input[type=range]').val());
      }

    });
    $(document).on("mouseout", range_wrapper, function() {
      if (!range_mousedown) {

        var thumb = $(this).children('.thumb');

        if (thumb.hasClass('active')) {
          thumb.velocity({ height: "0", width: "0", top: "10px", marginLeft: "-6px"}, { duration: 100 });
        }
        thumb.removeClass('active');
      }
    });

    //  Select Functionality

    // Select Plugin
    $.fn.material_select = function (callback) {
      $(this).each(function(){
        $select = $(this);

        if ( $select.hasClass('browser-default') || $select.hasClass('initialized')) {
          return; // Continue to next (return false breaks out of entire loop)
        }

        var uniqueID = guid();
        var wrapper = $('<div class="select-wrapper"></div>');
        var options = $('<ul id="select-options-' + uniqueID+'" class="dropdown-content select-dropdown"></ul>');
        var selectOptions = $select.children('option');
        if ($select.find('option:selected') !== undefined) {
          var label = $select.find('option:selected');
        }
        else {
          var label = options.first();
        }


        // Create Dropdown structure
        selectOptions.each(function () {
          // Add disabled attr if disabled
          options.append($('<li class="' + (($(this).is(':disabled')) ? 'disabled' : '') + '"><span>' + $(this).html() + '</span></li>'));
        });


        options.find('li').each(function (i) {
          var $curr_select = $select;
          $(this).click(function () {
            // Check if option element is disabled
            if (!$(this).hasClass('disabled')) {
              $curr_select.find('option').eq(i).prop('selected', true);
              // Trigger onchange() event
              $curr_select.trigger('change');
              $curr_select.siblings('input.select-dropdown').val($(this).text());
              if (typeof callback !== 'undefined') callback();
            }
          });

        });

        // Wrap Elements
        $select.wrap(wrapper);
        // Add Select Display Element
        var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '')
                         + ' data-activates="select-options-' + uniqueID +'" value="'+ label.html() +'"/><i class="md-arrow-drop-down">');
        $select.before($newSelect);
        $('body').append(options);
        // Check if section element is disabled
        if (!$select.is(':disabled')) {
          $newSelect.dropdown({"hover": false});
        }
        $select.addClass('initialized');

        $newSelect.on('focus', function(){
          $(this).trigger('open');
          label = $(this).val();
          selectedOption = options.find('li').filter(function() {
            return $(this).text().toLowerCase() === label.toLowerCase();
          })[0];
          activateOption(options, selectedOption);
        });


        $newSelect.on('blur', function(){

            $(this).trigger('close');
            
            var that = this;

            setTimeout(function () {

                var select = $("select", that.parentElement);

                if (select && select[0].eventListeners) {

                    select[0].eventListeners.forEach(function (eventName) {

                        var event = new Event(eventName);
                        select[0].dispatchEvent(event);

                    });

                }

            }, 250);

        });

        // Make option as selected and scroll to selected position
        activateOption = function(collection, newOption) {
          collection.find('li.active').removeClass('active');
          $(newOption).addClass('active');
          collection.scrollTo(newOption);
        }

        // Allow user to search by typing
        // this array is cleared after 1 second
        filterQuery = []

        onKeyDown = function(event){
          // TAB - switch to another input
          if(event.which == 9){
            $newSelect.trigger('close');
            return
          }

          // ARROW DOWN WHEN SELECT IS CLOSED - open select options
          if(event.which == 40 && !options.is(":visible")){
            $newSelect.trigger('open');
            return
          }

          // ENTER WHEN SELECT IS CLOSED - submit form
          if(event.which == 13 && !options.is(":visible")){
            return
          }

          event.preventDefault();

          // CASE WHEN USER TYPE LETTERS
          letter = String.fromCharCode(event.which).toLowerCase();

          if (letter){
            filterQuery.push(letter);

            string = filterQuery.join("");

            newOption = options.find('li').filter(function() {
              return $(this).text().toLowerCase().indexOf(string) === 0;
            })[0];

            if(newOption){
              activateOption(options, newOption);
            }
          }

          // ENTER - select option and close when select options are opened
          if(event.which == 13){
            activeOption = options.find('li.active:not(.disabled)')[0];
            if(activeOption){
              $(activeOption).trigger('click');
              $newSelect.trigger('close');
            }
          }

          // ARROW DOWN - move to next not disabled option
          if(event.which == 40){
            newOption = options.find('li.active').next('li:not(.disabled)')[0];
            if(newOption){
              activateOption(options, newOption);
            }
          }

          // ESC - close options
          if(event.which == 27){
            $newSelect.trigger('close');
          }

          // ARROW UP - move to previous not disabled option
          if(event.which == 38){
            newOption = options.find('li.active').prev('li:not(.disabled)')[0];
            if(newOption){
              activateOption(options, newOption);
            }
          }

          // Automaticaly clean filter query so user can search again by starting letters
          setTimeout(function(){filterQuery = []}, 1000)
        }

        $newSelect.on('keydown', onKeyDown);
      });
    }

    // Unique ID
    var guid = (function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
      };
    })();

  });

}( jQuery ));


(function($) {
  $.fn.extend({
    openModal: function(options) {
      var modal = this;
      var overlay = $('<div id="lean-overlay"></div>');
      $("body").append(overlay);

      var defaults = {
        opacity: 0.5,
        in_duration: 300,
        out_duration: 200,
        ready: undefined,
        complete: undefined,
        dismissible: true
      }

      // Override defaults
      options = $.extend(defaults, options);

      if (options.dismissible) {
        $("#lean-overlay").click(function() {
          $(modal).closeModal(options);
        });
        // Return on ESC
        $(document).keyup(function(e) {
          if (e.keyCode === 27) {   // ESC key
            $(modal).closeModal(options);
            $(this).off();
          }
        });
      }

      $(modal).find(".modal-close").click(function(e) {
        e.preventDefault();
        $(modal).closeModal(options);
      });

      $("#lean-overlay").css({ display : "block", opacity : 0 });

      $(modal).css({
        display : "block",
        top: "4%",
        opacity: 0
      });

      $("#lean-overlay").velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: "easeOutCubic"});

      $(modal).velocity({top: "10%", opacity: 1}, {
        duration: options.in_duration,
        queue: false,
        ease: "easeOutCubic",
        // Handle modal ready callback
        complete: function() {
          if (typeof(options.ready) === "function") {
            options.ready();
          }
        }
      });
    }
  });

  $.fn.extend({
    closeModal: function(options) {
      var defaults = {
        out_duration: 200,
        complete: undefined
      }
      var options = $.extend(defaults, options);

      $('.modal-close').off();

      $("#lean-overlay").velocity( { opacity: 0}, {duration: options.out_duration, queue: false, ease: "easeOutQuart"});
      $(this).fadeOut(options.out_duration, function() {
        $(this).css({ top: 0});
        $("#lean-overlay").css({display:"none"});

        // Call complete callback
        if (typeof(options.complete) === "function") {
          options.complete();
        }
        $('#lean-overlay').remove();
      });
    }
  })

  $.fn.extend({
    leanModal: function(options) {
      return this.each(function() {
        // Close Handlers
        $(this).click(function(e) {
          var modal_id = $(this).attr("href");
          $(modal_id).openModal(options);
          e.preventDefault();
        }); // done set on click
      }); // done return
    }
  });
})(jQuery);

(function ($) {

  // Add posibility to scroll to selected option
  // usefull for select for example
  $.fn.scrollTo = function(elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
  };

  $.fn.dropdown = function (options) {
    var defaults = {
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Constrains width of dropdown to the activator
      hover: true,
      alignment: 'left',
      gutter: 0, // Spacing from edge
      belowOrigin: false
    }

    options = $.extend(defaults, options);
    this.each(function(){
    var origin = $(this);

    // Dropdown menu
    var activates = $("#"+ origin.attr('data-activates'));

    function updateOptions() {
      if (origin.data('inDuration') != undefined)
        options.inDuration = origin.data('inDuration');
      if (origin.data('outDuration') != undefined)
        options.outDuration = origin.data('outDuration');
      if (origin.data('constrainwidth') != undefined)
        options.constrain_width = origin.data('constrainwidth');
      if (origin.data('hover') != undefined)
        options.hover = origin.data('hover');
      if (origin.data('alignment') != undefined)
        options.alignment = origin.data('alignment');
      if (origin.data('gutter') != undefined)
        options.gutter = origin.data('gutter');
      if (origin.data('beloworigin') != undefined)
        options.belowOrigin = origin.data('beloworigin');
    }

    updateOptions();

    // Move Dropdown menu to body. This allows for absolute positioning to work
    if ( !(activates.parent().is($('body'))) ) {
      activates.detach();
      $('body').append(activates);
    }

    var dropdownRealHeight = activates.height();

    /*
      Helper function to position and resize dropdown.
      Used in hover and click handler.
    */
    function placeDropdown() {
      // Check html data attributes
      updateOptions();

      if (options.constrain_width == true) {
        activates.css('width', origin.outerWidth());
      }
      var offset = 0;
      if (options.belowOrigin == true) {
        offset = origin.height();
      }
      // Handle edge alignment
      var width_difference = 0;
      var gutter_spacing = options.gutter;
      if (options.alignment == 'right') {
        width_difference = origin.innerWidth() - activates.innerWidth();
        gutter_spacing = gutter_spacing * -1;
      }
      if (elementOrParentIsFixed(origin[0])) {
        activates.css({
          display: 'block',
          position: 'fixed',
          height: 0,
          top: origin.offset().top - $(window).scrollTop() + offset,
          left: origin.offset().left + width_difference + gutter_spacing
        });
      }
      else {
        activates.css({
          display: 'block',
          top: origin.offset().top + offset,
          left: origin.offset().left + width_difference + gutter_spacing,
          height: 0
        });
      }
      activates.velocity({opacity: 1}, {duration: options.inDuration, queue: false, easing: 'easeOutQuad'})
      .velocity(
      {
        height: dropdownRealHeight
      },
      {duration: options.inDuration,
        queue: false,
        easing: 'easeOutCubic',
        complete: function(){
          activates.css('overflow-y', 'auto')
        }
      });
    }
    function elementOrParentIsFixed(element) {
        var $element = $(element);
        var $checkElements = $element.add($element.parents());
        var isFixed = false;
        $checkElements.each(function(){
            if ($(this).css("position") === "fixed") {
                isFixed = true;
                return false;
            }
        });
        return isFixed;
    }

    function hideDropdown() {
      activates.velocity(
        {
          opacity: 0
        },
        {
          duration: options.outDuration,
          easing: 'easeOutQuad',
          complete: function(){
            activates.css({
              display: 'none',
              'overflow-y': ''
            });
          }
        });
    }

    // Hover
    if (options.hover) {
      // Hover handler to show dropdown
      origin.on('mouseover', function(e){ // Mouse over
        placeDropdown();
      });

      // Document click handler
      activates.on('mouseleave', function(e){ // Mouse out
        hideDropdown();
      });

    // Click
    } else {
      var open = false;

      // Click handler to show dropdown
      origin.unbind('click.' + origin.attr('id'));
      origin.bind('click.'+origin.attr('id'), function(e){
        if (origin[0] == e.currentTarget) {

          e.preventDefault(); // Prevents button click from moving window
          placeDropdown();
        }

        $(document).bind('click.'+ activates.attr('id'), function (e) {
          if (!activates.is(e.target) && !origin.is(e.target) && (!origin.find(e.target).length > 0) ) {
            hideDropdown();
            $(document).unbind('click.' + activates.attr('id'));
          }
        });
      });

    } // End else

    // Listen to open and close event - useful for select component
    origin.on('open', placeDropdown);
    origin.on('close', hideDropdown);


   });
  }; // End dropdown plugin
}( jQuery ));
