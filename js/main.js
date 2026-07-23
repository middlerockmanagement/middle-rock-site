/* =============================================================
   Middle Rock Management - main.js
   Progressive enhancement only. The site is fully functional
   with JavaScript disabled; this file adds polish on top.
   ============================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Auto copyright year ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------- Click-to-email: build mailto: from split parts so the raw
     address is never present in the page HTML (spam-harvester resistant) --------- */
  document.querySelectorAll("[data-e-user][data-e-domain]").forEach(function (el) {
    var addr = el.getAttribute("data-e-user") + "@" + el.getAttribute("data-e-domain");
    el.setAttribute("href", "mailto:" + addr);
    el.removeAttribute("data-e-user");
    el.removeAttribute("data-e-domain");
  });

  /* ---------------- Sticky header shadow --------------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav toggle ------------------ */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.setAttribute("data-open", String(open));
      document.body.style.overflow = open && window.innerWidth <= 820 ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close on nav link click (mobile) and on Escape
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.innerWidth <= 820) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) { nav.removeAttribute("data-open"); document.body.style.overflow = ""; }
    });
  }

  /* ---------------- Reveal on scroll ------------------- */
  var reveal = document.querySelectorAll("[data-reveal]");
  if (reveal.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveal.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // Gentle stagger for grouped items
            var delay = el.hasAttribute("data-reveal-stagger") ? i * 60 : 0;
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            obs.unobserve(el);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveal.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------- Discipline filter (dropdown) ------------------ */
  var group = document.querySelector("[data-filter-group]");
  var grid = document.querySelector("[data-roster-grid]");
  if (group && grid) {
    group.hidden = false; // reveal now that JS can drive it
    var select = group.querySelector("[data-filter-select]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    var status = document.querySelector("[data-filter-status]");

    var apply = function (filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var tokens = (card.getAttribute("data-disciplines") || "").split(/\s+/);
        var match = filter === "all" || tokens.indexOf(filter) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (status) {
        status.textContent = filter === "all"
          ? "Showing all " + shown + " clients."
          : "Showing " + shown + " client" + (shown === 1 ? "" : "s") + ".";
      }
    };

    if (select) select.addEventListener("change", function () { apply(select.value); });
  }

  /* ---------- Values lexicon: accordion on mobile, full on desktop ---------- */
  var lex = Array.prototype.slice.call(document.querySelectorAll(".lex"));
  if (lex.length) {
    var lexDesktop = window.matchMedia("(min-width: 760px)");
    var setLex = function (item, open) {
      item.classList.toggle("is-open", open);
      var b = item.querySelector(".lex__summary");
      if (b) b.setAttribute("aria-expanded", String(open));
    };
    lex.forEach(function (item) {
      var btn = item.querySelector(".lex__summary");
      if (!btn) return;
      btn.addEventListener("click", function () {
        if (lexDesktop.matches) return; // desktop isn't an accordion
        var isOpen = item.classList.contains("is-open");
        lex.forEach(function (o) { setLex(o, false); });
        setLex(item, !isOpen);
      });
    });
    var syncLex = function () {
      if (lexDesktop.matches) {
        lex.forEach(function (it) { setLex(it, true); });      // all shown
      } else {
        lex.forEach(function (it, i) { setLex(it, i === 0); }); // first open
      }
    };
    syncLex();
    lexDesktop.addEventListener("change", syncLex);
  }

  /* ---------------- Back-to-top button ---------------- */
  var toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    var onTopScroll = function () {
      toTop.setAttribute("data-visible", window.scrollY > 600 ? "true" : "false");
    };
    onTopScroll();
    window.addEventListener("scroll", onTopScroll, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
