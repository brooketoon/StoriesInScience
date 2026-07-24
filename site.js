(function () {
  "use strict";

  /* =========================================================
     SITE CONFIG — edit these three values and nothing else.
     ---------------------------------------------------------
     sampleLessonUrl  : the PUBLIC lesson anyone may try.
     interestListUrl  : your email signup form.
     licensingContactUrl : contact form or mailto: link.

     lessonUrls: the three study lessons are intentionally NOT
     linked publicly while the IRB study is live. Fill a URL in
     to turn its "Open the lesson" button on for that lesson.
     ========================================================= */
  var SITE_CONFIG = {
    sampleLessonUrl: "https://btoon-maker.github.io/Orientation-The-Sneaker-Mystery/",
    interestListUrl: "REPLACE_WITH_YOUR_INTEREST_FORM_URL",
    licensingContactUrl: "REPLACE_WITH_YOUR_LICENSING_CONTACT_URL",
    lessonUrls: {
      eco: "",      // https://btoon-maker.github.io/Eco-Responders-5th/
      impact: "",   // https://btoon-maker.github.io/Impact-Motors-5th/
      mission: "",  // https://btoon-maker.github.io/Mission-Control-5th/
      puppy: ""
    }
  };

  /* NGSS mappings below are DRAFT and must be verified against the official
     NGSS performance expectations before publishing. Note that Arizona and
     NGSS assign several of these topics to different grade levels. */
  var LESSONS = {
    eco: {
      title: "Eco-Responders: After the Fire",
      tags: ["Life science", "AZ 5.L4U3.11", "NGSS 5-ESS3-1", "60–75 min"],
      role: "Environmental response team member",
      question: "A wildfire has moved through a desert riparian area. What should recovery focus on first?",
      does: "Reviews post-fire field evidence, chooses which site data to investigate, builds a feedback-loop model of the ecosystem, and writes a recovery recommendation.",
      thinking: "Systems and system models; cause and effect; constructing evidence-based explanations.",
      product: "An exported field journal with the evidence collected, the ecosystem model, and the written recommendation.",
      ngss: "5-ESS3-1 — communities using science ideas to protect Earth's resources and environment (draft mapping)"
    },
    impact: {
      title: "Impact Motors: Crash Investigation",
      tags: ["Physical science", "AZ 5.P2U1.3", "NGSS 3-PS2-1", "60–75 min"],
      role: "Junior safety analyst at a vehicle test facility",
      question: "Two test vehicles behaved differently in the same collision. Why?",
      does: "Chooses an investigation path, analyses crash test data, tests a model of force and motion, and delivers a safety recommendation supported by evidence.",
      thinking: "Cause and effect; planning and carrying out investigations; analysing and interpreting data.",
      product: "An exported field journal with the data analysed, the model built, and the final recommendation.",
      ngss: "3-PS2-1 — effects of balanced and unbalanced forces on motion (NGSS places this at Grade 3; draft mapping)"
    },
    mission: {
      title: "Mission Control: Tracking Aurora-3",
      tags: ["Earth & space", "AZ 5.E2U1.8", "NGSS 5-PS2-1", "60–75 min"],
      role: "Orbital response intern at a satellite operations centre",
      question: "The Aurora-3 satellite is showing a signal anomaly. What is happening to its orbit?",
      does: "Interprets motion and signal evidence, tests competing explanations, uses an interactive orbit modeler to change variables and observe results, then explains how the orbit is maintained.",
      thinking: "Patterns; cause and effect; developing and using models; engaging in argument from evidence.",
      product: "An exported field journal including the orbit model configuration, the reasoning at each decision point, and the mission recommendation.",
      ngss: "5-PS2-1 — gravitational force exerted by Earth on objects (partial mapping; verify before publishing)"
    },
    puppy: {
      title: "Puppy Patterns: The Shelter Genetics Case",
      tags: ["Life science", "AZ 5.L3U1.9", "NGSS 3-LS3-1", "60–75 min"],
      role: "Junior genetics investigator at an animal shelter",
      question: "A litter arrives with no records. What can their traits tell us about their parents?",
      does: "Compares traits across family groups, chooses which evidence to pursue, identifies inheritance patterns, and explains how information passes from parents to offspring.",
      thinking: "Patterns; analysing and interpreting data; constructing explanations.",
      product: "An exported field journal with the trait comparisons, the pattern identified, and the written explanation.",
      ngss: "3-LS3-1 / 3-LS3-2 — inherited traits and environmental influence (NGSS places this at Grade 3; draft mapping)"
    }
  };

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) { return; }

  function closeNav() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    syncNavInert();
  }

  // Keep collapsed links out of the tab order on small screens.
  function syncNavInert() {
    var collapsed = window.innerWidth <= 980 && !nav.classList.contains("is-open");
    if ("inert" in HTMLElement.prototype) {
      nav.inert = collapsed;
    } else {
      nav.querySelectorAll("a").forEach(function (a) {
        if (collapsed) { a.setAttribute("tabindex", "-1"); }
        else { a.removeAttribute("tabindex"); }
      });
    }
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("nav-open", !open);
    syncNavInert();
  });

  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 980) { closeNav(); }
      syncNavInert();
    }, 120);
  });
  syncNavInert();

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Lesson filter ---------- */
  var filters = document.querySelectorAll(".filter");
  var lessons = document.querySelectorAll(".lesson");
  var count = document.querySelector(".lesson-count");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (f) { f.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var want = btn.dataset.filter;
      var shown = 0;
      lessons.forEach(function (card) {
        var visible = want === "all" || card.dataset.domain === want;
        card.hidden = !visible;
        if (visible) { shown += 1; }
      });
      count.textContent = "Showing " + shown + " featured lesson" + (shown === 1 ? "" : "s");
    });
  });

  /* ---------- Modals, with a real focus trap ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var lastFocused = null;
  var activeModal = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    activeModal = modal;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var first = modal.querySelector(".modal-close");
    if (first) { first.focus(); }
  }

  function closeModal() {
    if (!activeModal) { return; }
    activeModal.hidden = true;
    activeModal = null;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") { lastFocused.focus(); }
  }

  function trapTab(e) {
    if (!activeModal || e.key !== "Tab") { return; }
    var items = Array.prototype.filter.call(
      activeModal.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) { return; }
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeNav(); }
    trapTab(e);
  });

  document.querySelectorAll(".backdrop").forEach(function (bd) {
    bd.addEventListener("click", function (e) {
      if (e.target === bd || e.target.closest(".modal-close") || e.target.closest(".modal-dismiss")) {
        closeModal();
      }
    });
  });

  /* ---------- Lesson detail modal ---------- */
  var lessonModal = document.getElementById("modal-lesson");

  function showLesson(key) {
    var data = LESSONS[key];
    if (!data || !lessonModal) { return; }

    document.getElementById("lesson-title").textContent = data.title;

    var meta = document.getElementById("lesson-meta");
    meta.textContent = "";
    data.tags.forEach(function (t, i) {
      var s = document.createElement("span");
      s.className = "tag" + (i === 1 ? " tag-teal" : i === 2 ? " tag-amber" : "");
      s.textContent = t;
      meta.appendChild(s);
    });

    var rows = [
      ["Student role", data.role],
      ["Driving question", data.question],
      ["What they do", data.does],
      ["Thinking used", data.thinking],
      ["What they keep", data.product],
      ["NGSS mapping", data.ngss]
    ];
    var list = document.getElementById("lesson-detail");
    list.textContent = "";
    rows.forEach(function (row) {
      var li = document.createElement("li");
      var b = document.createElement("b");
      b.textContent = row[0];
      var span = document.createElement("span");
      span.textContent = row[1];
      li.appendChild(b); li.appendChild(span);
      list.appendChild(li);
    });

    var actions = document.getElementById("lesson-actions");
    actions.textContent = "";
    var url = SITE_CONFIG.lessonUrls[key];
    if (url) {
      var open = document.createElement("a");
      open.className = "btn";
      open.href = url;
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "Open the lesson";
      actions.appendChild(open);
    } else if (SITE_CONFIG.sampleLessonUrl) {
      var sample = document.createElement("a");
      sample.className = "btn btn-amber";
      sample.href = SITE_CONFIG.sampleLessonUrl;
      sample.target = "_blank";
      sample.rel = "noopener";
      sample.textContent = "Try the free orientation lesson";
      actions.appendChild(sample);
    }
    var join = document.createElement("button");
    join.className = "btn btn-ghost";
    join.type = "button";
    join.textContent = "Join the interest list";
    join.addEventListener("click", function () {
      closeModal();
      if (/^https?:/.test(SITE_CONFIG.interestListUrl)) {
        window.open(SITE_CONFIG.interestListUrl, "_blank", "noopener");
      } else {
        openModal(document.getElementById("modal-interest"));
      }
    });
    actions.appendChild(join);

    openModal(lessonModal);
  }

  document.querySelectorAll(".js-lesson").forEach(function (btn) {
    btn.addEventListener("click", function () { showLesson(btn.dataset.lesson); });
  });

  /* ---------- Wire up CTAs once, on load ---------- */
  function wire(selector, url, fallbackModalId) {
    var valid = /^(https?:|mailto:)/.test(url);
    document.querySelectorAll(selector).forEach(function (el) {
      if (valid && el.tagName === "A") {
        el.href = url;
        if (/^https?:/.test(url)) { el.target = "_blank"; el.rel = "noopener"; }
        return;
      }
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(document.getElementById(fallbackModalId));
      });
    });
  }

  wire(".js-sample", SITE_CONFIG.sampleLessonUrl, "modal-interest");
  wire(".js-interest", SITE_CONFIG.interestListUrl, "modal-interest");
  wire(".js-licensing", SITE_CONFIG.licensingContactUrl, "modal-licensing");

  document.querySelectorAll("[data-policy]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(document.getElementById("modal-policy"));
    });
  });

  /* ---------- Headshot placeholder fallback ---------- */
  var photo = document.getElementById("founder-photo");
  var fallback = document.getElementById("founder-fallback");
  if (photo && fallback) {
    var useFallback = function () { photo.hidden = true; fallback.hidden = false; };
    photo.addEventListener("error", useFallback);
    if (photo.complete && photo.naturalWidth === 0) { useFallback(); }
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
