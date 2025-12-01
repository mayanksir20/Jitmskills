(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-white shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-white shadow-sm').css('top', '-150px');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // ==========================
    // Header + Text synced carousel
    // ==========================
    var heroText = $(".hero-text-carousel");
    var heroImage = $(".header-carousel");

    heroText.owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        items: 1,
        dots: false,
        nav: false
    });

    heroImage.owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        items: 1,
        dots: true,
        nav: false
    });

    // helper: convert owl event index (which includes clones) -> real index
    function realIndexFromEvent(e) {
        var count = e.item.count;
        var index = e.item.index;
        var clones = (e.relatedTarget && e.relatedTarget._clones) ? e.relatedTarget._clones.length / 2 : 0;
        var real = index - clones;
        real = ((real % count) + count) % count;
        return real;
    }

    heroImage.on('changed.owl.carousel translated.owl.carousel', function(event) {
        var r = realIndexFromEvent(event);
        heroText.trigger('to.owl.carousel', [r, 600, true]);
    });

    heroText.on('changed.owl.carousel translated.owl.carousel', function(event) {
        var r = realIndexFromEvent(event);
        heroImage.trigger('to.owl.carousel', [r, 600, true]);
    });

    // ==========================
    // Testimonials carousel
    // ==========================
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        dots: true,
        loop: true,
        nav: false
    });

})(jQuery);
