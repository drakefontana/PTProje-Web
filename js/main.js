// Scroll to top functionality
$("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});

// Inquire Modal Toggle
$(".toggleInquireModal").click(function(event) {
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    $("#inquireModal").toggleClass("active");
    $("#navMenu").removeClass("active");
});

$("#exitInquireModal").click(function() {
    $("#inquireModal").removeClass("active");
});

// Video Modal Toggle
$(".more-content-toggler").click(function() {
    $("#videoModal").toggleClass("active");
});

// Header Menus
$(document).ready(function() {
  // Common variables
  let start;
  let animationFrameId;

  // For Main Menu
  let menuOpen = false;
  const navMenu = document.getElementById('navMenu');

  // Initialize Lottie animation for Main Menu
  const menuAnimation = lottie.loadAnimation({
    container: document.getElementById('menu-animation'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/anim/PTP_Menu_Icon.json'
  });

  menuAnimation.addEventListener('DOMLoaded', function() {
    menuAnimation.goToAndStop(0, true);
    navMenu.style.maxHeight = "0vh";
  });

  $('#menu-container').click(function() {
    menuOpen = !menuOpen;

    if (menuOpen) {
      menuAnimation.setDirection(1);
      menuAnimation.playSegments([0, menuAnimation.totalFrames - 1], true);
      navMenu.style.maxHeight = "86vh";  // You can adjust this value
    } else {
      menuAnimation.setDirection(-1);
      menuAnimation.playSegments([menuAnimation.currentFrame, 0], true);
      navMenu.style.maxHeight = "0vh";
    }
  });

  // For Agency Portal
  let agencyOpen = false;
  const loginMenu = document.getElementById('loginMenu');

  // Initialize Lottie animation for Agency Portal
  const agencyAnimation = lottie.loadAnimation({
    container: document.getElementById('agency-animation'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/anim/PTP-Header-AgencyPortal-Icon.json'
  });

  agencyAnimation.addEventListener('DOMLoaded', function() {
    agencyAnimation.goToAndStop(0, true);
    loginMenu.style.maxHeight = '0vh';
  });

  $('#agency-container').click(function() {
    agencyOpen = !agencyOpen;

    if (agencyOpen) {
      agencyAnimation.setDirection(1);
      agencyAnimation.playSegments([0, agencyAnimation.totalFrames - 1], true);
      loginMenu.style.maxHeight = "86vh";  // You can adjust this value
    } else {
      agencyAnimation.setDirection(-1);
      agencyAnimation.playSegments([agencyAnimation.currentFrame, 0], true);
      loginMenu.style.maxHeight = "0vh";
    }
  });
});



// AOS Init
AOS.init();

// OWL CAROUSEL Init
$(document).ready(function() {
    $(".owl-carousel").owlCarousel({
        items: 2.3,
        responsive: {
            0: {
                items: 1.1,
            },
            600: {
                items: 1.1,
            },
            1000: {
                items: 2.3,
            },
        },
        center: true,
        nav: false,
        autoplay: false,
        margin: 0,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        dots: false,
        loop: true,
    });
});
$(function() {
    $("#open").accordion({
        active: 0 // This is the index of the section that will be open when the page loads
    });
});