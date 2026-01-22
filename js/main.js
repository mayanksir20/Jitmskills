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
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 100) {
            $('.sticky-top')
                .addClass('bg-white shadow-sm');
        } else {
            $('.sticky-top')
                .removeClass('bg-white shadow-sm');
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

// ==========================
// DOMContentLoaded Init
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    // --- Hero Section - Counter Up ---
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
    startCount();

    // --- Modal text truncation ---
    document.querySelectorAll(".team-desc").forEach(desc => {
        let words = desc.innerText.trim().split(" ");
        if (words.length > 20) {
            desc.innerText = words.slice(0, 20).join(" ") + "...";
        }
    });

    // --- Counting numbers for achievements ---
    const achievementCounters = document.querySelectorAll(".count");
    if (achievementCounters.length) {
        const startCounter = (counter) => {
            const target = +counter.getAttribute("data-target");
            let current = 0;
            const increment = target / 150;

            const update = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            update();
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        achievementCounters.forEach(counter => observer.observe(counter));
    }

    // --- Reverse news order ---
    const container = document.getElementById("newsContainer");
    if (container) {
        const newsItems = Array.from(container.children);
        newsItems.reverse().forEach(item => container.appendChild(item));
    }

    // --- Press releases and gallery filter initialization ---
    showFilteredItems();
});

// --- News modal ---
function openNews(element) {
    const cardBody = element.parentElement;
    const title = cardBody.querySelector('h5').innerText;
    const fullContent = cardBody.querySelector('.news-full').innerHTML;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = fullContent;

    var myModal = new bootstrap.Modal(document.getElementById('newsModal'));
    myModal.show();
}

// --- Spotlight slides ---
const slides = document.querySelectorAll(".spotlight-feature");
let currentSlide = 0;
setInterval(() => {
    slides[currentSlide]?.classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide]?.classList.add("active");
}, 5000);

// --- View more news ---
const step = 2;
function loadMoreNews() {
    const hiddenNews = document.querySelectorAll('.extra-news.d-none');
    for (let i = 0; i < step && i < hiddenNews.length; i++) {
        hiddenNews[i].classList.remove('d-none');
    }

    if (document.querySelectorAll('.extra-news.d-none').length === 0) {
        const btn = document.getElementById('viewMoreBtn');
        btn.innerText = 'No More News';
        btn.disabled = true;
    }
}

// --- Gallery Filtering ---
let activeCategory = 'all';
let visibleCountLimit = 9;
const loadStep = 4;
window.onload = () => updateGalleryDisplay();

function filter(cat, element) {
    document.querySelectorAll('.roadmap-step').forEach(step => step.classList.remove('active'));
    element.classList.add('active');
    activeCategory = cat;
    visibleCountLimit = 9;
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

    if (currentlyShownCount >= matchingImagesCount) {
        btn.innerHTML = "No More Photos";
        btn.classList.add('disabled-btn');
        btn.disabled = true;
    } else {
        btn.innerHTML = "View More";
        btn.classList.remove('disabled-btn');
        btn.disabled = false;
        btn.style.display = 'inline-block';
    }
}

// --- TV Ticker ---
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

document.querySelectorAll(".ticker-content").forEach(container => {
    titles.forEach(title => {
        const span = document.createElement("span");
        span.innerHTML = "▶ " + title.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        container.appendChild(span);
    });
});

// --- Lightbox ---
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

    if (displayedCount >= matchCount) {
        btn.disabled = true;
        btn.innerText = "No More Content";
        msg.style.display = "block";
    } else {
        btn.disabled = false;
        btn.innerText = "View More Stories";
        msg.style.display = "none";
    }
}

function loadMore() { currentItems += 9; showFilteredItems(); }
function toggleFilterSidebar() { document.querySelector('.media-sidebar').classList.toggle('show-filters'); }

document.addEventListener("DOMContentLoaded", showFilteredItems);

// --- Articles Data & Modal ---
const articlesData = [
    { id: 1, category: "Government Schemes", catClass: "bg-success", title: "DDU-GKY: Training se Sustainable Jobs tak ka Safar", shortDesc: "Kaise JITM Skills DDU-GKY ke through rural youth ko job-ready aur employable bana raha hai.", img: "img/ddu-gky.jpg", readTime: "6 Min Read", fullContent: `<p class="lead fw-bold text-success">Rural Youth Empowerment – Ground Level Impact</p><p>DDU-GKY sirf ek government scheme nahi hai, balki rural youth ke liye sustainable livelihood ka ek strong pathway hai. JITM Skills ne multiple states me residential training, soft skills aur employer linkage ke saath real placements deliver kiye hain.</p><ul class="list-group list-group-flush mb-3"><li class="list-group-item border-0 px-0"><i class="fas fa-check-circle text-success me-2"></i>Structured mobilization, counselling aur batch planning</li><li class="list-group-item border-0 px-0"><i class="fas fa-check-circle text-success me-2"></i>Industry-aligned curriculum with placement tracking</li></ul><p>Training ka real success tab hota hai jab candidate long-term employment me sustain kar paaye.</p>` },
    { id: 2, category: "Skill India", catClass: "bg-primary", title: "PMKVY: Quality Training aur Employability ka Real Connection", shortDesc: "PMKVY ke under skill training ka focus sirf numbers par nahi, quality par hota hai.", img: "img/pmkvy-certificate.jpg", readTime: "5 Min Read", fullContent: `<p class="lead fw-bold text-primary">Skill India with Quality & Outcome Focus</p><p>PMKVY ka impact tab visible hota hai jab training, assessment aur placement ek saath align hote hain. JITM Skills NOS-based delivery aur certified trainers ke saath candidates ko industry-ready banata hai.</p><div class="bg-light p-3 rounded border-start border-4 border-primary mb-3"><i>“Certification tab meaningful hoti hai jab skill employable ho.”</i></div><p>Employer engagement, assessment readiness aur post-placement tracking PMKVY ke core success factors hain.</p>` },
    { id: 3, category: "Digital Skills", catClass: "bg-info text-dark", title: "Digital Skills: Aaj ke Job Market ki Basic Requirement", shortDesc: "Basic computer knowledge se le kar workplace digital tools tak ka safar.", img: "img/Digital Skills.png", readTime: "4 Min Read", fullContent: `<p class="lead fw-bold text-info">Digital Literacy se Digital Confidence tak</p><p>Aaj ke competitive job market me digital skills optional nahi rahi. JITM Skills apni training me computer basics, online communication aur workplace tools ko integrate karta hai.</p><ul class="list-group list-group-flush mb-3"><li class="list-group-item border-0 px-0"><i class="fas fa-check-circle text-info me-2"></i>MS Office, email etiquette aur digital documentation</li><li class="list-group-item border-0 px-0"><i class="fas fa-check-circle text-info me-2"></i>Sector-specific digital exposure</li></ul><p>Ye skills candidates ko sirf placement hi nahi, balki long-term career growth ke liye bhi ready karti hain.</p>` },
    { id: 4, category: "Youth Empowerment", catClass: "bg-dark", title: "Skill Training se Career Confidence tak", shortDesc: "Technical skills ke saath confidence aur mindset ka development kyun zaroori hai.", img: "img/Leadership Team.jpeg", readTime: "6 Min Read", fullContent: `<p class="lead fw-bold text-dark">Beyond Skills – Building Career Confidence</p><p>Sirf skill training kaafi nahi hoti. Communication skills, workplace behaviour aur confidence youth ke career journey me decisive role play karte hain.</p><div class="bg-light p-3 rounded border-start border-4 border-dark mb-3"><i>“Skills job dilati hain, confidence career banata hai.”</i></div><p>JITM Skills ka holistic training model candidates ko interview-ready aur workplace-ready banata hai.</p>` }
];

function displayArticles() {
    const container = document.getElementById('article-container');
    if (!container) return;
    container.innerHTML = articlesData.map(article => `
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm article-card overflow-hidden h-100 flex-md-row">
                <div class="col-md-5 position-relative">
                    <img src="${article.img}" class="w-100 h-100" style="object-fit:cover" alt="article">
                    <span class="badge-category ${article.catClass}">${article.category}</span>
                </div>
                <div class="col-md-7 p-4 bg-white">
                    <h5 class="fw-bold text-start mb-2">${article.title}</h5>
                    <p class="text-muted small">${article.shortDesc}</p>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small text-muted"><i class="far fa-clock"></i> ${article.readTime}</span>
                        <button onclick="openModal(${article.id})" class="btn btn-sm btn-outline-primary rounded-pill">Read Article</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
displayArticles();

function openModal(id) {
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalImg').src = article.img;
    document.getElementById('modalContent').innerHTML = article.fullContent;

    const header = document.getElementById('modalHeaderBg');
    if (header) header.className = 'modal-header border-0 p-4 ' + article.catClass;

    const myModal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    myModal.show();
}

// --- Career Form ---
function setJob(jobName) {
    document.querySelectorAll('.mainDesignation').forEach(i => i.value = jobName);
}
function openApplyModal(jobName) {
    setJob(jobName);
    var myModal = new bootstrap.Modal(document.getElementById('applyModal'));
    myModal.show();
}

document.querySelectorAll('.careerForm').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let currentForm = this;
        let phone = currentForm.querySelector('[name="phone"]').value;

        if (phone.length < 10) {
            Swal.fire({ icon: 'warning', title: 'Check Phone Number', text: 'Please enter a valid 10-digit number.', confirmButtonColor: '#f1c40f' });
            return;
        }

        let isHq = currentForm.querySelector('[name="noida_hq"]')?.checked;
        let isPolicy = currentForm.querySelector('[name="transfer_policy"]')?.checked;
        let confirmText = (isHq && isPolicy) ? "Do you want to submit your application?" : "Note: You haven't agreed to all office policies. Submit anyway?";

        Swal.fire({
            title: 'Are you sure?',
            text: confirmText,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e3a8a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Submit Now!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: 'Sending...', text: 'Please wait', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                fetch(window.location.href, { method: 'POST', body: new FormData(currentForm) })
                    .then(r => r.text())
                    .then(data => {
                        if (data.trim() === "Success") {
                            Swal.fire({ icon: 'success', title: 'Application Sent!', text: 'Your CV has been mailed to info@jitmskills.com', confirmButtonColor: '#28a745' });
                            currentForm.reset();
                            let modalEl = document.getElementById('applyModal');
                            let modalInstance = bootstrap.Modal.getInstance(modalEl);
                            if (modalInstance) modalInstance.hide();
                        } else {
                            Swal.fire({ icon: 'error', title: 'Mail Failed', text: 'Error: ' + data, confirmButtonColor: '#dc3545' });
                        }
                    })
                    .catch((err) => {
                        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Check your internet or localhost connection.', confirmButtonColor: '#dc3545' });
                    });
            }
        });
    });
});



// ---toggle-bg-coler-change-js
(function ($) {
    "use strict";

    const header = document.querySelector(".sticky-top");
    const menu = document.getElementById("navbarCollapse");

    if (header && menu) {

        // MENU OPEN
        // menu.addEventListener("show.bs.collapse", function () {
        //     header.style.backgroundColor = "#fff";
        //     header.style.height = "100vh";
        // });
        menu.addEventListener("show.bs.collapse", function () {
            header.style.backgroundImage = "url('/img/hero-bg.png')";
            header.style.backgroundSize = "cover";
            header.style.backgroundPosition = "center";
            header.style.backgroundRepeat = "no-repeat";
            header.style.height = "100vh";
        });


        // MENU CLOSE
        menu.addEventListener("hide.bs.collapse", function () {
            header.style.height = "auto";

            if (window.scrollY < 100) {
                header.style.backgroundColor = "transparent";
            }
        });

    }

})(jQuery);

// --active-menu-js
document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar-nav a").forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            // current page menu active
            link.classList.add("active");

            // agar dropdown ke andar hai
            const parentDropdown = link.closest(".dropdown");
            if (parentDropdown) {
                parentDropdown
                    .querySelector(".nav-link")
                    .classList.add("parent-active");
            }
        }
    });
});


// ---logo-scroll-clone-js
document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector('.logo-track');
    track.innerHTML += track.innerHTML; // Clone automatically for smooth infinite scroll
});






 const logos = document.querySelector(".logos");
  const trigger = document.querySelector("#scroll-trigger");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          logos.classList.add("hide-on-scroll");
        } else {
          logos.classList.remove("hide-on-scroll");
        }
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-500px 0px 0px 0px"
    }
  );

  observer.observe(trigger);