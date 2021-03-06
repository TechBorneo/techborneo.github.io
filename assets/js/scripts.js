(function($) {
  "use strict";

  $(document).ready(function() {

    /*	Local Scroll
  	================================================== */

    jQuery('.navbar').localScroll({
      offset: -80,
      duration: 500
    });

    jQuery('#hero').localScroll({
      duration: 500
    });

    /*	Active Menu
  	================================================== */

    jQuery(function() {
      var sections = jQuery('section');
      var navigation_links = jQuery('nav a');
      sections.waypoint({
        handler: function(direction) {
          var active_section;
          active_section = jQuery(this);
          if (direction === "up") active_section = active_section.prev();
          var active_link = jQuery('nav a[href="#' + active_section.attr("id") + '"]');
          navigation_links.parent().removeClass("active");
          active_link.parent().addClass("active");
          active_section.addClass("active-section");
        },
        offset: '35%'
      });
    });

    /*	Bootstrap Carousel
  	================================================== */

    jQuery('.carousel').carousel();

    /* Subscribe Form
    ================================================== */

    jQuery('#subscribe_form').on("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $emailInput   = jQuery('#email');
      var $submitButton = jQuery('#submit_button');

      // Disable input and change button text
      $emailInput.prop('disabled', true);
      $submitButton.prop('disabled', true);
      $submitButton.val("Inviting...");

      slack_invite($emailInput.val(), function() {
        $emailInput.prop('disabled', false);
        $submitButton.prop('disabled', false);
        $submitButton.val("Join TechBorneo");
      });
    });

  });

  jQuery(window).load(function() {

    $('.section').each(function() {
      animate_start($(this));
    });

  });

  /*	Animation with Waypoints
	================================================== */

  var animate_start = function($this) {
    $this.find('.animate').each(function(i) {
      var $item = jQuery(this);
      var animation = $item.data("animate");

      $item.waypoint(function(direction) {
        $item.css({
          '-webkit-animation-delay': (i * 0.1) + "s",
          '-moz-animation-delay': (i * 0.1) + "s",
          '-ms-animation-delay': (i * 0.1) + "s",
          '-o-animation-delay': (i * 0.1) + "s",
          'animation-delay': (i * 0.1) + "s"
        });
        $item.removeClass('animate').addClass('animated ' + animation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          jQuery(this).removeClass(animation + ' animated');
        });
      }, {
        offset: '80%',
        triggerOnce: true
      });
    });
  };

  /*  Slack Invite
  ================================================== */
  var slack_invite = function(email, completeCallback) {
    if (email.trim() == "") {
      alert("Please enter your email address");
      completeCallback();
      return;
    }

    var apiDomain = "https://slack.sabah.io";
    var endpointUrl = "/team-invite.php";

    $.ajax({
      url: apiDomain + endpointUrl,
      data: {
        invite_email: email
      },
      dataType: "jsonp",
      success: function(data) {
        if (data.ok) {
          $('#subscribe_modal').modal();
        } else {
          switch(data.error) {
            case "already_in_team":
              alert("You are already in the community. Go to techborneo.slack.com to login.");
              break;
            case "already_invited":
              alert("You have already been invited. Check your email.");
              break;
            case "invalid_email":
              alert("Please enter an valid email address");
              break;
            default:
              alert("Oops. Something went wrong. Please try again later.");
          }
        }
        completeCallback();
      },
      error: function(data) {
        alert("Oops. Something went wrong. Please try again later.");
        completeCallback();
      }
    });
  }

})(jQuery);
