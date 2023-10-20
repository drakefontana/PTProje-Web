$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
}); 
// Menu
 
  $("#toggleNavMenu").click(function(event){
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    $("#navMenu").toggleClass("active");
    $("#loginMenu").removeClass("active");

  });
  
  $("#exitNavMenu").click(function(){
    $("#navMenu").removeClass("active");
  });

  $("#toggleLoginMenu").click(function(event){
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    $("#loginMenu").toggleClass("active");
    $("#navMenu").removeClass("active");

  });
  
  $("#exitLoginMenu").click(function(){
    $("#loginMenu").removeClass("active");
  });
  
  $(".toggleInquireModal").click(function(event){
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    $("#inquireModal").toggleClass("active");
    $("#navMenu").removeClass("active");

  });
  
  $("#exitInquireModal").click(function(){
    $("#inquireModal").removeClass("active");
  });
  
  $(".more-content-toggler").click(function(){
    $("#videoModal").toggleClass("active");
  });

// AOS Init
AOS.init();

// OWL CAROUSEL Init
$(document).ready(function () {
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
$( function() {
  $( "#open" ).accordion({
    active: 0 // This is the index of the section that will be open when the page loads
  });
} );