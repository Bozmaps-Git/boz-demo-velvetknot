
function __lf(s,w,h){var a=['img/g1.jpg','img/g2.jpg','img/g3.jpg','img/g4.jpg','img/g5.jpg','img/g6.jpg'];var n=0,x=String(s);for(var i=0;i<x.length;i++){n=(n*31+x.charCodeAt(i))>>>0;}return a[n%a.length];}
function __av(s){return 'https://i.pravatar.cc/200?u=velvetknot'+encodeURIComponent(String(s));}
/* ============================================================
   The Velvet Knot — interactive features (vanilla JS)
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Year in footer ---- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var navToggle = $("#navToggle");
  var primaryNav = $("#primaryNav");
  var backdrop = null;

  function openNav() {
    primaryNav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    backdrop = document.createElement("button");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-label", "Close menu");
    backdrop.addEventListener("click", closeNav);
    document.body.appendChild(backdrop);
  }
  function closeNav() {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (backdrop) { backdrop.remove(); backdrop = null; }
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navToggle.getAttribute("aria-expanded") === "true" ? closeNav() : openNav();
    });
  }
  /* Close drawer when a nav link is clicked (mobile) */
  $$("#primaryNav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.innerWidth < 1024) closeNav();
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && primaryNav.classList.contains("open")) { closeNav(); navToggle.focus(); }
  });

  /* ============================================================
     FEATURE A — Package "enquire" buttons → prefill consultation
     ============================================================ */
  $$(".pkg-enquire").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pkg = btn.getAttribute("data-package");
      var select = $("#cf-package");
      if (select) {
        Array.prototype.forEach.call(select.options, function (o) {
          if (o.value === pkg || o.textContent === pkg) select.value = o.value;
        });
      }
      var target = $("#consultation");
      if (target) target.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
      setTimeout(function () { var n = $("#cf-name"); if (n) n.focus(); }, prefersReduced() ? 0 : 600);
    });
  });

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ============================================================
     FEATURE B — Portfolio gallery + filter + lightbox
     ============================================================ */
  var portfolio = [
    { seed: "vk-glen-01", title: "Eilidh & Marcus", meta: "Highland castle · Luxe", style: "luxe" },
    { seed: "vk-barn-02", title: "Niamh & Calum", meta: "Perthshire barn · Country", style: "country" },
    { seed: "vk-city-03", title: "Sofia & James", meta: "New Town townhouse · Modern", style: "modern" },
    { seed: "vk-isle-04", title: "Rhona & Adam", meta: "Isle of Skye elopement · Intimate", style: "intimate" },
    { seed: "vk-loch-05", title: "Grace & Daniel", meta: "Lochside marquee · Country", style: "country" },
    { seed: "vk-ball-06", title: "Anya & Theo", meta: "Signet Library · Luxe", style: "luxe" },
    { seed: "vk-loft-07", title: "Maya & Lewis", meta: "Leith warehouse · Modern", style: "modern" },
    { seed: "vk-gard-08", title: "Iona & Finlay", meta: "Walled garden · Intimate", style: "intimate" },
    { seed: "vk-hall-09", title: "Priya & Ross", meta: "Hopetoun House · Luxe", style: "luxe" }
  ];

  var galleryEl = $("#gallery");
  portfolio.forEach(function (item, i) {
    var li = document.createElement("li");
    li.className = "gallery-item";
    li.setAttribute("data-style", item.style);
    var url = "" + __lf(item.seed, 640, 800) + "";
    li.innerHTML =
      '<button class="gallery-btn" data-index="' + i + '" aria-label="View larger image: ' + item.title + ', ' + item.meta + '">' +
      '<img src="' + url + '" loading="lazy" width="640" height="800" alt="Wedding of ' + item.title + ' — ' + item.meta + '" />' +
      '<span class="gallery-cap"><span class="gc-title">' + item.title + '</span><span class="gc-meta">' + item.meta + '</span></span>' +
      '</button>';
    galleryEl.appendChild(li);
  });

  /* Filter */
  $$(".filter-btn[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      $$(".filter-btn[data-filter]").forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      $$(".gallery-item").forEach(function (li) {
        var show = f === "all" || li.getAttribute("data-style") === f;
        li.classList.toggle("hide", !show);
      });
    });
  });

  /* Lightbox */
  var lightbox = $("#lightbox");
  var lbImg = $("#lbImg");
  var lbCaption = $("#lbCaption");
  var lbClose = $("#lbClose");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lastFocused = null;
  var currentIndex = 0;

  function visibleIndices() {
    return $$(".gallery-item").reduce(function (acc, li, idx) {
      if (!li.classList.contains("hide")) acc.push(idx);
      return acc;
    }, []);
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
    document.addEventListener("keydown", lbKeys);
  }
  function renderLightbox() {
    var item = portfolio[currentIndex];
    lbImg.src = "" + __lf(item.seed, 900, 1100) + "";
    lbImg.alt = "Wedding of " + item.title + " — " + item.meta;
    lbCaption.textContent = item.title + " — " + item.meta;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", lbKeys);
    if (lastFocused) lastFocused.focus();
  }
  function step(dir) {
    var vis = visibleIndices();
    var pos = vis.indexOf(currentIndex);
    if (pos === -1) pos = 0;
    pos = (pos + dir + vis.length) % vis.length;
    currentIndex = vis[pos];
    renderLightbox();
  }
  function lbKeys(e) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      /* simple focus trap */
      var f = [lbClose, lbPrev, lbNext];
      var idx = f.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (idx <= 0 ? f.length - 1 : idx - 1) : (idx + 1) % f.length;
      f[next].focus();
    }
  }
  galleryEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".gallery-btn");
    if (btn) openLightbox(parseInt(btn.getAttribute("data-index"), 10));
  });
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { step(-1); });
  lbNext.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });

  /* ============================================================
     FEATURE C — Consultation form validation + success
     ============================================================ */
  var form = $("#consultForm");
  var success = $("#consultSuccess");

  function setError(id, msg) {
    var input = $("#cf-" + id);
    var err = $("#err-" + id);
    if (err) err.textContent = msg || "";
    if (input) {
      if (msg) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
    return !msg;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      success.hidden = true;
      var ok = true;
      var firstBad = null;

      var name = $("#cf-name").value.trim();
      if (!name) { setError("name", "Please tell us your names."); ok = false; firstBad = firstBad || "#cf-name"; }
      else setError("name", "");

      var email = $("#cf-email").value.trim();
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) { setError("email", "Please add an email so we can reply."); ok = false; firstBad = firstBad || "#cf-email"; }
      else if (!emailRe.test(email)) { setError("email", "That doesn't look like a valid email."); ok = false; firstBad = firstBad || "#cf-email"; }
      else setError("email", "");

      var dateVal = $("#cf-date").value;
      if (!dateVal) { setError("date", "Please choose a wedding date."); ok = false; firstBad = firstBad || "#cf-date"; }
      else {
        var chosen = new Date(dateVal + "T00:00:00");
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (chosen < today) { setError("date", "Please choose a date in the future."); ok = false; firstBad = firstBad || "#cf-date"; }
        else setError("date", "");
      }

      var guests = $("#cf-guests").value;
      var g = parseInt(guests, 10);
      if (!guests) { setError("guests", "Roughly how many guests?"); ok = false; firstBad = firstBad || "#cf-guests"; }
      else if (isNaN(g) || g < 2) { setError("guests", "Please enter 2 or more."); ok = false; firstBad = firstBad || "#cf-guests"; }
      else if (g > 500) { setError("guests", "Please enter 500 or fewer."); ok = false; firstBad = firstBad || "#cf-guests"; }
      else setError("guests", "");

      if (!ok) { if (firstBad) $(firstBad).focus(); return; }

      success.textContent = "Thank you, " + name + " — your enquiry is in. We'll be in touch within two working days to arrange your consultation.";
      success.hidden = false;
      form.reset();
      success.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" });
      success.focus && success.setAttribute("tabindex", "-1");
    });
  }

  /* ============================================================
     FEATURE D — Vendor directory + filter
     ============================================================ */
  var vendors = [
    { seed: "vk-photo-1", type: "photographer", name: "Aileen Frost Photography", desc: "Quiet, documentary-led storytelling with a soft editorial finish.", loc: "Edinburgh & Lothians" },
    { seed: "vk-photo-2", type: "photographer", name: "North Light Studio", desc: "Film and digital blended for warm, timeless wedding albums.", loc: "Glasgow & West" },
    { seed: "vk-photo-3", type: "photographer", name: "Murdo & Bell", desc: "A husband-and-wife duo capturing the unscripted moments.", loc: "Highlands & Islands" },
    { seed: "vk-flor-1", type: "florist", name: "Thistle & Twine", desc: "Seasonal, garden-gathered arrangements with a wild romance.", loc: "Stockbridge, Edinburgh" },
    { seed: "vk-flor-2", type: "florist", name: "Bramble Floral Co.", desc: "Sculptural installations and lush, textural tablescapes.", loc: "Leith, Edinburgh" },
    { seed: "vk-flor-3", type: "florist", name: "The Walled Garden", desc: "Home-grown British blooms, ethically and locally sourced.", loc: "Perthshire" },
    { seed: "vk-venue-1", type: "venue", name: "Hopetoun House", desc: "A neoclassical country estate with sweeping Firth views.", loc: "South Queensferry" },
    { seed: "vk-venue-2", type: "venue", name: "The Signet Library", desc: "Georgian grandeur in the heart of Edinburgh's Old Town.", loc: "Edinburgh Old Town" },
    { seed: "vk-venue-3", type: "venue", name: "Glen Tanar Estate", desc: "A Highland glen with a candlelit ballroom and ancient pines.", loc: "Royal Deeside" }
  ];

  var typeLabel = { photographer: "Photographer", florist: "Florist", venue: "Venue" };
  var vendorGrid = $("#vendorGrid");
  vendors.forEach(function (v) {
    var li = document.createElement("li");
    li.className = "vendor-card";
    li.setAttribute("data-type", v.type);
    var url = "" + __lf(v.seed, 640, 400) + "";
    li.innerHTML =
      '<img src="' + url + '" loading="lazy" width="640" height="400" alt="' + v.name + ', a ' + typeLabel[v.type].toLowerCase() + ' in ' + v.loc + '" />' +
      '<div class="vendor-body">' +
      '<p class="vendor-type">' + typeLabel[v.type] + '</p>' +
      '<h3>' + v.name + '</h3>' +
      '<p>' + v.desc + '</p>' +
      '<p class="vendor-loc">' + v.loc + '</p>' +
      '</div>';
    vendorGrid.appendChild(li);
  });

  $$(".vfilter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-vfilter");
      $$(".vfilter").forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      $$(".vendor-card").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-type") === f;
        card.classList.toggle("hide", !show);
      });
    });
  });

  /* ============================================================
     FEATURE E — Testimonials carousel
     ============================================================ */
  var testimonials = [
    { rating: 5, quote: "The Velvet Knot turned a misty afternoon at a Highland castle into the most elegant day of our lives. Every detail was considered, every supplier perfect.", couple: "Eilidh & Marcus", detail: "Glen Tanar Estate · September 2025" },
    { rating: 5, quote: "We came with a Pinterest board and a budget that frightened us. They made it feel calm, achievable and genuinely beautiful — better than we'd imagined.", couple: "Sofia & James", detail: "New Town townhouse · June 2025" },
    { rating: 5, quote: "On the day we didn't lift a finger. Our families kept saying how relaxed we looked. That was entirely down to the team running everything quietly behind us.", couple: "Niamh & Calum", detail: "Perthshire barn · August 2024" },
    { rating: 5, quote: "Just the two of us on Skye, with a celebrant and a photographer. They planned an elopement that felt intimate and utterly us. We still can't quite believe it.", couple: "Rhona & Adam", detail: "Isle of Skye · May 2025" },
    { rating: 5, quote: "Honest, warm and impeccably organised. They steered us away from things we'd have regretted and toward the moments that actually mattered.", couple: "Anya & Theo", detail: "The Signet Library · October 2024" }
  ];

  var track = $("#carouselTrack");
  var dotsWrap = $("#carDots");
  var carIndex = 0;
  var carTimer = null;

  function stars(n) {
    var s = "";
    for (var i = 0; i < 5; i++) s += i < n ? "★" : "☆";
    return s;
  }

  testimonials.forEach(function (t, i) {
    var li = document.createElement("li");
    li.className = "carousel-slide";
    li.setAttribute("role", "group");
    li.setAttribute("aria-roledescription", "slide");
    li.setAttribute("aria-label", (i + 1) + " of " + testimonials.length);
    li.innerHTML =
      '<p class="stars" aria-label="' + t.rating + ' out of 5 stars">' + stars(t.rating) + '</p>' +
      '<blockquote class="carousel-quote">' + t.quote + '</blockquote>' +
      '<p class="carousel-author">' + t.couple + '<span>' + t.detail + '</span></p>';
    track.appendChild(li);

    var dot = document.createElement("button");
    dot.className = "car-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Testimonial " + (i + 1));
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", function () { goTo(i, true); });
    dotsWrap.appendChild(dot);
  });

  function goTo(i, userInitiated) {
    carIndex = (i + testimonials.length) % testimonials.length;
    track.style.transform = "translateX(-" + (carIndex * 100) + "%)";
    $$(".car-dot", dotsWrap).forEach(function (d, di) {
      d.setAttribute("aria-selected", di === carIndex ? "true" : "false");
    });
    if (userInitiated) restartAuto();
  }
  function restartAuto() {
    if (carTimer) clearInterval(carTimer);
    if (prefersReduced()) return;
    carTimer = setInterval(function () { goTo(carIndex + 1); }, 6500);
  }

  $("#carPrev").addEventListener("click", function () { goTo(carIndex - 1, true); });
  $("#carNext").addEventListener("click", function () { goTo(carIndex + 1, true); });
  var carouselEl = $(".carousel");
  carouselEl.addEventListener("mouseenter", function () { if (carTimer) clearInterval(carTimer); });
  carouselEl.addEventListener("mouseleave", restartAuto);
  carouselEl.addEventListener("focusin", function () { if (carTimer) clearInterval(carTimer); });
  carouselEl.addEventListener("focusout", restartAuto);
  restartAuto();

  /* ============================================================
     Scroll reveal (respects reduced motion)
     ============================================================ */
  var revealTargets = $$(".approach-card, .package-card, .vendor-card, .section-title, .gallery-item");
  if ("IntersectionObserver" in window && !prefersReduced()) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
})();
