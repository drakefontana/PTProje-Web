// Scroll to top functionality
$("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
});

// Form Submission Patterns
var ptrn = {
    'isEmail': /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]{2,7}$/,
    'isNumber': /^[0-9]$/,
    'isInteger': /^[\s\d]$/,
    'isFloat': /^[0-9]?\d+(\.\d+)?$/,
    'isVersion': /^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/,
    'isPassword': /^[A-Za-z0-9@#$%^&*()!_-]{4,32}$/,
    'isParagraph': /^[^()]{40,255}$/,
    'isEmpty': /^[^()]{3,255}$/,
    'isSelectEmpty': /^[^()]{1,255}$/,
    'isZipcode': /^\+[0-9]{1,4}$/,
    'isPhone': /^[\s\d]{9,11}$/,
    'setNumber': /^[^\d|\-+|\.+]$/
};

// Error Messages
var errorMsg = {
    'isEmail': 'Please enter a valid Email',
    'isNumber': 'Please enter a valid number',
    'isInteger': 'Please enter a valid number',
    'isFloat': 'Please enter a number with a comma',
    'isVersion': 'Please enter a valid version number',
    'isPassword': 'A password can contain numbers, letters and @ # $% ^ & * ()! _ -',
    'isParagraph': 'Text is too short or longer than 255 characters',
    'isEmpty': 'This field cannot be empty',
    'isSelectEmpty': 'Please select an item from the list',
    'isZipcode': 'Please enter a valid zipcode',
    'isPhone': 'Please enter a valid phone number',
    'setNumber': 'Please enter a valid number'
};

// Set Cover Button State
function _setCvrBtn(tar, param) {
    $(tar).attr("disabled", param);
}

// Check Form Fields
function chk(e, tar, form) {
    var isError = '';
    if (typeof tar === 'object') {
        for (var key in tar) {
            var elm = $(form + ' #' + key);
            if (ptrn[tar[key]].test($(elm).val())) {
                _setError(elm, '', true);
            } else {
                _setError(elm, errorMsg[tar[key]]);
                isError += tar[key];
            }
        }
    } else {
        if (ptrn[tar].test(e.value)) {
            _setError(e, '', true);
        } else {
            _setError(e, errorMsg[tar]);
            isError += tar;
        }
    }
    return isError.length > 0 ? false : true;
}

// Set Error Message
function _setError(elm, msg, clr) {
    !msg ? msg = "" : msg;
    !clr ? clr = false : clr;

    var tar = $(elm).parent();
    if (elm.type == "checkbox") {
        tar = $(elm).parent().parent().parent();
    }
    if ($('.error-message', tar).html() == undefined) {
        $(tar).append('<div class="error-message"></div>');
    }
    $('.error-message', tar).text(msg);
}

// Get Errors from Server Response
function _getErrors(obj, form_name) {
    (form_name[0] == '#' || form_name[0] == '.') ? form_name: form_name = '#' + form_name;
    $(".error-message").text('');
    for (var prop in obj) {
        var value = obj[prop];
        if (typeof obj[prop] !== 'object') {
            continue;
        }
        var arr = $.map(value, function(val, index) {
            return [val];
        });
        var elm = $(form_name + ' [name="' + prop + '"]');
        if (Array.isArray(elm)) {
            _setError($(form_name + ' [name="' + prop + '"]')[0], arr[0]);
        } else {
            _setError($(form_name + ' [name="' + prop + '"]'), arr[0]);
        }
    }
}

// Send Form Data
function doSend(form) {
    !form ? form = '#form' : form;

    var isValid = chk(false, {
        'first-name-input': 'isEmpty',
        'last-name-input': 'isEmpty',
        'email-input': 'isEmail'
    }, form);


    if (isValid) {
        _setCvrBtn('#form_btn', true);
        $.ajax({
                url: 'send.php',
                method: "POST",
                data: {
                    first_name: $(form + ' #first-name-input').val(),
                    last_name: $(form + ' #last-name-input').val(),
                    telephone: $(form + ' #telephone-input').val(),
                    email: $(form + ' #email-input').val().toLowerCase(),
                    project: $(form + ' #project-input').val(),
                    company: $(form + ' #company-input').val(),
                    id: 1,
                },
            })
            .done(function(res) {
                _setCvrBtn('#form_btn', false);
                var response = JSON.parse(res);
                if (response.status == 'SUCCESS') {
                    // ... [handling successful response] ...
                } else {
                    alert('Sending failed, please try again.');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                _setCvrBtn('#form_btn', false);
                console.error("AJAX request failed:", textStatus, errorThrown, jqXHR.responseText);
                console.log("Full server response:", jqXHR); // More detailed logging
                alert('Error in form submission. Please try again.');
            });
    } else {
        alert('Please fill required fields and try again.');
    }
}

// Inquire Modal Toggle
$(document).ready(function() {
    // Initialize Lottie animation for 'x' close button
    let isLottieSupported = true; // Assume Lottie is supported initially
    const closeButtonAnimation = lottie.loadAnimation({
        container: document.getElementById('exitInquireModal'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'anim/PTP-Close-Form-Icon.json', // Replace with your actual JSON path
        rendererSettings: {
            progressiveLoad: false // Helps in quicker detection of unsupported browsers
        }
    });

    closeButtonAnimation.addEventListener('DOMLoaded', function() {
        closeButtonAnimation.goToAndStop(0, true);
        closeButtonAnimation.setSpeed(1.5); // Set the speed to twice as fast
    });

    closeButtonAnimation.addEventListener('error', function() {
        isLottieSupported = false; // Lottie is not supported
        $('#fallback-button-close').show(); // Show the fallback SVG
    });


    // Event handler for opening/closing the inquire modal
    $(".toggleInquireModal").click(function(event) {
        event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
        $("#inquireModal").toggleClass("active");
        $("#navMenu").removeClass("active");
    });

    // Event handler for 'x' close button hover
    $('#exitInquireModal').hover(
        function() {
            // Hover in
            closeButtonAnimation.setDirection(1);
            closeButtonAnimation.playSegments([0, closeButtonAnimation.totalFrames - 1], true);
        },
        function() {
            // Hover out
            closeButtonAnimation.setDirection(-1);
            closeButtonAnimation.playSegments([closeButtonAnimation.currentFrame, 0], true);
        }
    );

    // Event handler for 'x' close button click
    $('#exitInquireModal').click(function() {
        $("#inquireModal").removeClass("active");
        resetFormFields(); // Call to reset form fields
    });

    // Function to reset form fields
    function resetFormFields() {
        $('#form')[0].reset(); // Resets the form
        $(".error-message").text(''); // Clears any error messages
    }


    // Form submission logic
    $('.inquire_form').submit(function(e) {
        e.preventDefault();
        return doSend();
        //     // Simulate AJAX call or other form submission logic here
        //     // ...

        //     // On successful "submission"
        //     $('.inquire_form').hide(); // Hide the form
        //     $('#thank-you-message').removeClass('thank-you-hidden').addClass('thank-you-visible'); // Show thank-you message

        //     setTimeout(function() {
        //         $('#thank-you-message').removeClass('thank-you-visible').addClass('thank-you-hidden'); // Hide thank-you message
        //         $('.inquire_form').show(); // Show the form again
        //         $('.inquire_form')[0].reset(); // Clear the form
        //         $("#inquireModal").removeClass("active"); // Close the form automatically
        //     }, 2000); // 2 seconds
    });

});

// AOS Init
AOS.init();

// Header Menus
$(document).ready(function() {
    // Common variables
    let menuOpen = false;
    let agencyOpen = false;
    const navMenu = document.getElementById('navMenu');
    const loginMenu = document.getElementById('loginMenu');

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

    // Function to check if the clicked element is outside of the given element
    function isClickOutside(event, element) {
        return !element.contains(event.target);
    }

    // Function to close the menu
    function closeMenu() {
        menuAnimation.setDirection(-1);
        menuAnimation.playSegments([menuAnimation.currentFrame, 0], true);
        navMenu.style.maxHeight = "0vh";
        menuOpen = false;
    }

    // Function to close the agency portal
    function closeAgencyPortal() {
        agencyAnimation.setDirection(-1);
        agencyAnimation.playSegments([agencyAnimation.currentFrame, 0], true);
        loginMenu.style.maxHeight = "0vh";
        agencyOpen = false;
    }

    // Event listener for document click to close the menu if clicked outside
    $(document).click(function(event) {
        if (menuOpen && isClickOutside(event, navMenu) && isClickOutside(event, $('#menu-container')[0])) {
            closeMenu();
        }
        if (agencyOpen && isClickOutside(event, loginMenu) && isClickOutside(event, $('#agency-container')[0])) {
            closeAgencyPortal();
        }
    });

    // Prevent the event from closing the menu when clicking on the menu itself
    $('#navMenu, #loginMenu').click(function(event) {
        event.stopPropagation();
    });

    // Event handler for Main Menu toggle
    $('#menu-container').click(function(event) {
        if (menuOpen) {
            event.stopPropagation(); // Prevent the click from being propagated when the menu is open
            closeMenu();
        } else {
            menuOpen = true;
            menuAnimation.setDirection(1);
            menuAnimation.playSegments([0, menuAnimation.totalFrames - 1], true);
            navMenu.style.maxHeight = "100vh"; // You can adjust this value
        }
    });

    // Event handler for Agency Portal toggle
    $('#agency-container').click(function(event) {
        if (agencyOpen) {
            event.stopPropagation(); // Prevent the click from being propagated when the agency portal is open
            closeAgencyPortal();
        } else {
            agencyOpen = true;
            agencyAnimation.setDirection(1);
            agencyAnimation.playSegments([0, agencyAnimation.totalFrames - 1], true);
            loginMenu.style.maxHeight = "100vh"; // You can adjust this value
        }
    });

    // ... (any other code you may have)
});


// Navigation Hover Arrows
$(document).ready(function() {
    // Initialize Lottie animations for each menu item
    const arrowAnimations = {};
    $('.mainNav-Arrow').each(function(index, element) {
        const id = $(element).attr('id');
        arrowAnimations[id] = lottie.loadAnimation({
            container: element,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: '/anim/PTP-Home-HeroMenu-Hover.json' // Replace with the actual path
        });

        arrowAnimations[id].addEventListener('DOMLoaded', function() {
            console.log('DOMLoaded fired for:', id); // Debugging
            arrowAnimations[id].goToAndStop(0, true);
        });
    });

    // Hover interactions
    $('.nav-item').hover(
        function() { // Mouse enter
            const id = $(this).find('.mainNav-Arrow').attr('id');
            arrowAnimations[id].setDirection(1);
            arrowAnimations[id].playSegments([0, arrowAnimations[id].totalFrames - 1], true);
        },
        function() { // Mouse leave
            const id = $(this).find('.mainNav-Arrow').attr('id');
            arrowAnimations[id].setDirection(-1);
            arrowAnimations[id].playSegments([arrowAnimations[id].currentFrame, 0], true);
        }
    );
});

// Video Content
document.addEventListener("DOMContentLoaded", () => {
    const videoElement = document.getElementById("videoElement");
    videoElement.muted = true;

    // Function to check if any part of the element is in the viewport
    const isInViewport = (elem) => {
        const bounding = elem.getBoundingClientRect();
        return (
            bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.bottom >= 0 &&
            bounding.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.right >= 0
        );
    };


    // Autoplay video when in viewport
    const checkVideoInViewport = () => {
        if (isInViewport(videoElement)) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    };

    // Loop video
    videoElement.addEventListener("ended", () => {
        videoElement.currentTime = 0;
        videoElement.play();
    }, false);

    // Initial check and subsequent checks on scroll
    checkVideoInViewport();
    window.addEventListener("scroll", checkVideoInViewport);
});

// Accordian Expansion
$(document).ready(function() {
    // Initialize Lottie animations for Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach((item, index) => {
        const button = item.querySelector('.accordion-button');
        const collapseDiv = item.querySelector('.accordion-collapse');
        const animation = lottie.loadAnimation({
            container: button.querySelector('.lottie-container'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: '/anim/PTP-Detail-Expansion-Icon.json' // Replace with your Lottie JSON file path
        });

        animation.addEventListener('DOMLoaded', function() {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const initialFrame = isExpanded ? animation.totalFrames - 1 : 0;
            animation.goToAndStop(initialFrame, true);
        });

        // Listen to Bootstrap collapse events
        $(collapseDiv).on('show.bs.collapse', function() {
            animation.setSpeed(2); // Speed when opening
            animation.setDirection(1);
            animation.playSegments([0, animation.totalFrames - 1], true);
        });

        $(collapseDiv).on('hide.bs.collapse', function() {
            animation.setSpeed(2.5); // Speed when closing
            animation.setDirection(-1);
            animation.playSegments([animation.currentFrame, 0], true);
        });
    });
});

// Portfolio Carousel
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById('slider');
    const sliderItems = document.getElementById('slides');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    let slides = Array.from(sliderItems.getElementsByClassName('building'));
    const singleSlideSize = slider.offsetWidth / 2.3;
    const slideSize = singleSlideSize * 3;
    const centerOffset = (slider.offsetWidth - slideSize) / 2;

    // Clone slides for infinite loop
    slides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        sliderItems.appendChild(clone);
    });
    slides.slice().reverse().forEach((slide) => {
        const clone = slide.cloneNode(true);
        sliderItems.insertBefore(clone, sliderItems.firstChild);
    });

    // Update slides array to include clones
    slides = Array.from(sliderItems.getElementsByClassName('building'));

    let index = slides.length / 3; // Start from the first slide in the original set
    let startX, currentX, initialPos;

    const init = () => {
        sliderItems.style.left = `-${singleSlideSize * index + centerOffset}px`;
    };

    const shiftSlide = (dir) => {
        sliderItems.style.transition = 'left 0.3s ease-out'; // Enable transition
        index += dir;
        const posInitial = parseFloat(sliderItems.style.left);
        sliderItems.style.left = `${posInitial - (dir * singleSlideSize)}px`;

        setTimeout(() => { // Wait for transition to complete
            if (index >= slides.length * 2 / 3) {
                index = slides.length / 3;
                sliderItems.style.transition = 'none'; // Disable transition
                sliderItems.style.left = `-${singleSlideSize * index + centerOffset}px`;
            } else if (index < slides.length / 3) {
                index = slides.length * 2 / 3 - 1;
                sliderItems.style.transition = 'none'; // Disable transition
                sliderItems.style.left = `-${singleSlideSize * index + centerOffset}px`;
            }
        }, 300); // Match the transition duration
    };


    const handleStart = (e) => {
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        initialPos = parseFloat(sliderItems.style.left);
        sliderItems.style.transition = 'none';
    };

    const handleMove = (e) => {
        if (startX) {
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            let dx = currentX - startX;
            sliderItems.style.left = `${initialPos + dx}px`;
        }
    };

    const handleEnd = () => {
        if (startX && currentX) {
            let dx = currentX - startX;
            if (Math.abs(dx) > singleSlideSize / 3) {
                shiftSlide(dx > 0 ? -1 : 1);
            } else {
                sliderItems.style.left = `${initialPos}px`;
            }
        }
        startX = null;
        currentX = null;
        sliderItems.style.transition = 'left 0.3s ease-out';
    };

    prev.addEventListener('click', () => shiftSlide(-1));
    next.addEventListener('click', () => shiftSlide(1));

    sliderItems.addEventListener('touchstart', handleStart);
    sliderItems.addEventListener('touchmove', handleMove);
    sliderItems.addEventListener('touchend', handleEnd);

    sliderItems.addEventListener('mousedown', handleStart);
    sliderItems.addEventListener('mousemove', handleMove);
    sliderItems.addEventListener('mouseup', handleEnd);
    sliderItems.addEventListener('mouseleave', handleEnd);

    init();

    // Refresh AOS animations
    AOS.refresh();
});

// ------------END of HOME PAGE --------------

// Video Modal Toggle
$(".more-content-toggler").click(function() {
    $("#videoModal").toggleClass("active");
});

// ------------- Ecosystem Page -------------

// Section Link Spacing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Check if the clicked link is inside the .to_top div
        if (!this.closest('.to_top')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Calculate the position you want to scroll to
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight * 0.1);

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        // If it's inside .to_top, let the default action proceed
    });
});

// ---------------- Projects Page --------------

// Hero Nav Background Image Hover
document.addEventListener('DOMContentLoaded', function() {
    // Function to change the hero image and caption
    function changeHeroContent(projectId) {
        // References to default elements
        const defaultImage = document.getElementById('default-proj-feat-img');
        const defaultCaption = document.getElementById('default-caption');

        // Hide all images and captions
        document.querySelectorAll('.ptp-projects-feat, .image-caption').forEach(element => {
            element.classList.remove('active');
            element.classList.remove('default-active');
        });

        if (projectId === 'default') {
            // Show default elements
            defaultImage.classList.add('default-active');
            defaultCaption.classList.add('default-active');
        } else {
            // Show the selected image and caption
            const selectedImage = document.getElementById(projectId + '-proj-feat-img');
            const selectedCaption = document.getElementById(projectId + '-caption');
            if (selectedImage && selectedCaption) {
                selectedImage.classList.add('active');
                selectedCaption.classList.add('active');
            }
            // Explicitly hide default elements
            defaultImage.classList.remove('active');
            defaultCaption.classList.remove('active');
        }
    }

    // Initially set the default content
    changeHeroContent('default');

    // Attach event listeners to each nav item
    document.querySelectorAll('.nav-item-container a').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const projectId = this.getAttribute('href').split('.')[0];
            changeHeroContent(projectId);
        });
    });

    // Reset to default when not hovering over any nav item
    document.querySelector('.hero-nav').addEventListener('mouseleave', function() {
        changeHeroContent('default');
    });
});

// ---------------- Individual Project Carousel Menu ----------
document.addEventListener('DOMContentLoaded', function() {
    // Function to change the displayed carousel
    function changeDisplayedCarousel(carouselId) {
        // Hide all carousels
        document.querySelectorAll('.carousel').forEach(carousel => {
            carousel.style.display = 'none';
        });

        // Show the selected carousel
        const selectedCarousel = document.getElementById(carouselId);
        if (selectedCarousel) {
            selectedCarousel.style.display = 'block';
        }
    }

    // Attach event listeners to each nav item
    document.querySelectorAll('.nav-item a').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const carouselType = this.textContent.trim().toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
            const carouselId = `${carouselType}-carousel`;
            changeDisplayedCarousel(carouselId);
        });
    });

    // Initially display the exterior carousel
    changeDisplayedCarousel('exterior-carousel');
});