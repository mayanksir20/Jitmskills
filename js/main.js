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

    heroImage.on('changed.owl.carousel translated.owl.carousel', function (event) {
        var r = realIndexFromEvent(event);
        heroText.trigger('to.owl.carousel', [r, 600, true]);
    });

    heroText.on('changed.owl.carousel translated.owl.carousel', function (event) {
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


// Hero Section - Counter Up
function startCount() {
    const counters = document.querySelectorAll(".count");

    counters.forEach(counter => {
        counter.innerText = "0";
        const target = +counter.getAttribute("data-target");

        const update = () => {
            const current = +counter.innerText;
            const increment = target / 150;

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(update, 15);
            } else {
                counter.innerText = target;
            }
        };

        update();
    });
}

window.onload = startCount;


// Modal functionality
document.querySelectorAll(".team-desc").forEach(desc => {
    let words = desc.innerText.trim().split(" ");
    if (words.length > 20) {
        desc.innerText = words.slice(0, 20).join(" ") + "...";
    }
});


// -----counting-numbers-placement-hoglight-page-----
const counters = document.querySelectorAll('.counter');
const speed = 150;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = Math.ceil(target / speed);

        if (count < target) {
            counter.innerText = count + inc;
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
});




// ---news-----

function openNews(element) {
    const cardBody = element.parentElement;
    const title = cardBody.querySelector('h5').innerText;
    const fullContent = cardBody.querySelector('.news-full').innerHTML;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = fullContent;

    var myModal = new bootstrap.Modal(document.getElementById('newsModal'));
    myModal.show();
}


const slides = document.querySelectorAll(".spotlight-feature");
let currentSlide = 0;

setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
}, 5000);


// view-more-news.js
const step = 2;

function loadMoreNews() {
    const hiddenNews = document.querySelectorAll('.extra-news.d-none');

    // OLD NEWS pehle open hogi
    for (let i = 0; i < step && i < hiddenNews.length; i++) {
        hiddenNews[i].classList.remove('d-none');
    }

    if (document.querySelectorAll('.extra-news.d-none').length === 0) {
        const btn = document.getElementById('viewMoreBtn');
        btn.innerText = 'No More News';
        btn.disabled = true;
    }
}


// Reverse news order on page load
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("newsContainer");
    const newsItems = Array.from(container.children);

    // Reverse order so latest added news shows first
    newsItems.reverse().forEach(item => container.appendChild(item));
});



// Gallery Filtering
let activeCategory = 'all';
let visibleCountLimit = 9; // Initial limit
const loadStep = 4;        // Increment step

window.onload = () => {
    updateGalleryDisplay();
};

function filter(cat, element) {
    document.querySelectorAll('.roadmap-step').forEach(step => step.classList.remove('active'));
    element.classList.add('active');

    activeCategory = cat;
    visibleCountLimit = 9; // Category change hone par reset
    updateGalleryDisplay();
}

function loadMore() {
    visibleCountLimit += loadStep;
    updateGalleryDisplay();
}

function updateGalleryDisplay() {
    const allImages = document.querySelectorAll('.filter-item');
    const btn = document.getElementById('view-more-btn');
    let matchingImagesCount = 0;
    let currentlyShownCount = 0;

    allImages.forEach(img => {
        img.classList.remove('show-anim');
        if (activeCategory === 'all' || img.classList.contains(activeCategory)) {
            matchingImagesCount++;
            if (currentlyShownCount < visibleCountLimit) {
                img.classList.add('show-anim');
                currentlyShownCount++;
            }
        }
    });

    // Button Disable Logic
    if (currentlyShownCount >= matchingImagesCount) {
        btn.innerHTML = "No More Photos";
        btn.classList.add('disabled-btn');
        btn.disabled = true; // Button click hona band ho jayega
    } else {
        btn.innerHTML = "View More";
        btn.classList.remove('disabled-btn');
        btn.disabled = false;
        btn.style.display = 'inline-block';
    }
}



// --- gallery tv Ticker Logic ---
const titles = [
    "Skill Training से **Job** तक का सफर – Real Student Feedback",
    "Free Course ने बदल दी मेरी **Life** | Learner Review",
    "गाँव से **City Job** तक – An Inspiring Success Story",
    "Training के बाद **Placement मिला** | JITM Skills Experience",
    "**Skill India Program** – Real Stories, Real Results",
    "मुझे Training के बाद **Job मिली** – Candidate Feedback",
    "**Employer Review** – Skilled Candidates का Real Experience",
    "**Certificate Day** | Proud Moments & Career Growth",
    "**रोज़गार Opportunity** – Skills से Success की कहानी",
    "From Learning to **Earning** – हमारे Students की Real Journey"
];

const contents = document.querySelectorAll(".ticker-content");

contents.forEach(container => {
    titles.forEach(title => {
        const span = document.createElement("span");

        // FIX: highlight support
        span.innerHTML =
            "▶ " + title.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        container.appendChild(span);
    });
});



// Lightbox and Filter Logic for Press Releases
let hoverTimer;
let currentItems = 9;
let activeFilter = 'all';

function startHoverTimer(element) { hoverTimer = setTimeout(() => openLightbox(element), 3000); }
function cancelHoverTimer() { clearTimeout(hoverTimer); }

function openLightbox(element) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = element.querySelector('img').src;
    lb.style.display = 'flex';
    setTimeout(() => lb.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    setTimeout(() => lb.style.display = 'none', 300);
    document.body.style.overflow = 'auto';
}

function closeLightboxOverlay(e) { if (e.target.id === 'lightbox') closeLightbox(); }

function filterSelection(c) {
    activeFilter = c;
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute('onclick').includes(`'${c}'`));
    });
    currentItems = 9;
    showFilteredItems();
    if (window.innerWidth <= 850) document.querySelector('.media-sidebar').classList.remove('show-filters');
}

function showFilteredItems() {
    const items = document.querySelectorAll(".press-item");
    const btn = document.getElementById("loadMoreBtn");
    const msg = document.getElementById("endMessage");

    let matchCount = 0;
    let displayedCount = 0;

    items.forEach(item => {
        item.classList.remove("active");
        if (activeFilter === 'all' || item.classList.contains(activeFilter)) {
            matchCount++;
            if (displayedCount < currentItems) {
                item.classList.add("active");
                displayedCount++;
            }
        }
    });

    // Logic for Disable Button and Message
    if (displayedCount >= matchCount) {
        btn.disabled = true; // Button disable ho jayega
        btn.innerText = "No More Content"; // Text change ho jayega
        msg.style.display = "block"; // Red message dikhega
    } else {
        btn.disabled = false;
        btn.innerText = "View More Stories";
        msg.style.display = "none";
    }
}

function loadMore() { currentItems += 9; showFilteredItems(); }
function toggleFilterSidebar() { document.querySelector('.media-sidebar').classList.toggle('show-filters'); }

document.addEventListener("DOMContentLoaded", showFilteredItems);