// Scroll to top functionality
$("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});

// Menu
// Login Menu Toggle
$("#toggleLoginMenu").click(function(event) {
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    $("#loginMenu").toggleClass("active");
    $("#navMenu").removeClass("active");
});

$("#exitLoginMenu").click(function() {
    $("#loginMenu").removeClass("active");
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

// Initialize Lottie animation and menu toggle
$(document).ready(function() {
    let menuOpen = false;
    const navMenu = document.getElementById('navMenu');

    // Initialize Lottie animation
    const menuAnimation = lottie.loadAnimation({
        container: document.getElementById('menu-animation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/anim/PTP_Menu_Icon.json' // Replace with your JSON file path
    });

    // Set the animation to its initial frame
    menuAnimation.addEventListener('DOMLoaded', function() {
        menuAnimation.goToAndStop(0, true);
        navMenu.style.display = 'none'; // Initially hide navMenu
    });

    // Toggle menu state
    $('#menu-container').click(function() {
        menuOpen = !menuOpen;

        if (menuOpen) {
            // Open menu and play animation forward
            menuAnimation.setDirection(1);
            menuAnimation.playSegments([0, menuAnimation.totalFrames - 1], true);
            navMenu.style.display = 'block'; // Show navMenu
        } else {
            // Close menu and play animation in reverse
            menuAnimation.setDirection(-1);
            menuAnimation.playSegments([menuAnimation.currentFrame, 0], true);
            navMenu.style.display = 'none'; // Hide navMenu
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