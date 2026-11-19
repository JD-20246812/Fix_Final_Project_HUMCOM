/* ==========================================================
   MindBridge PH - shared script (basic JavaScript only)
   1. Mobile menu toggle
   2. Settings panel: high contrast, text size, readable font
   3. Service page: district list, facility list, calendar booking
   4. Breathing exercise
   ========================================================== */

(function () {
  "use strict";

  /* ---------- safe storage helpers ---------- */
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- 1. Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var navList = document.getElementById("main-nav");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- 2. Settings panel ---------- */
  var gear = document.getElementById("settings-btn");
  var panel = document.getElementById("settings-panel");
  var hcBtn = document.getElementById("hc-toggle");
  var fontBtn = document.getElementById("font-toggle");
  var sizeUp = document.getElementById("size-up");
  var sizeDown = document.getElementById("size-down");
  var root = document.documentElement;
  var size = parseInt(load("mb-size") || "1", 10);

  function applySize() {
    root.classList.remove("fs-2", "fs-3");
    if (size === 2) root.classList.add("fs-2");
    if (size === 3) root.classList.add("fs-3");
    save("mb-size", String(size));
  }
  function applyHC(on) {
    document.body.classList.toggle("hc", on);
    if (hcBtn) hcBtn.setAttribute("aria-pressed", String(on));
    save("mb-hc", on ? "1" : "0");
  }
  function applyFont(on) {
    document.body.classList.toggle("dyslexic", on);
    if (fontBtn) fontBtn.setAttribute("aria-pressed", String(on));
    save("mb-font", on ? "1" : "0");
  }
  applySize();
  applyHC(load("mb-hc") === "1");
  applyFont(load("mb-font") === "1");

  if (gear && panel) {
    gear.addEventListener("click", function () {
      var hidden = panel.hasAttribute("hidden");
      if (hidden) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      gear.setAttribute("aria-expanded", String(hidden));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hasAttribute("hidden")) {
        panel.setAttribute("hidden", "");
        gear.setAttribute("aria-expanded", "false");
        gear.focus();
      }
    });
  }
  if (hcBtn) hcBtn.addEventListener("click", function () { applyHC(!document.body.classList.contains("hc")); });
  if (fontBtn) fontBtn.addEventListener("click", function () { applyFont(!document.body.classList.contains("dyslexic")); });
  if (sizeUp) sizeUp.addEventListener("click", function () { size = Math.min(3, size + 1); applySize(); });
  if (sizeDown) sizeDown.addEventListener("click", function () { size = Math.max(1, size - 1); applySize(); });

  /* ---------- 3. Service page ---------- */
  var districtNav = document.getElementById("district-nav");
  if (districtNav) {
    /* Sample data. Replace with verified, current details before submission. */
    var DATA = [
      { name: "District 1", places: [
        { n: "Baguio General Hospital and Medical Center", a: "Governor Pack Road, Baguio City", t: "Mon-Fri, 8:00 AM - 5:00 PM" },
        { n: "Baguio City Health Services Office", a: "City Hall Compound, Baguio City", t: "Mon-Fri, 8:00 AM - 4:30 PM" }
      ]},
      { name: "District 2", places: [
        { n: "Barangay Health Center (sample)", a: "Barangay hall area, Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Community Counselling Desk (sample)", a: "Barangay hall area, Baguio City", t: "Tue and Thu, 9:00 AM - 3:00 PM" }
      ]},
      { name: "District 3", places: [
        { n: "University Guidance Center (sample)", a: "Campus area, Baguio City", t: "Mon-Fri, 9:00 AM - 5:00 PM" },
        { n: "Barangay Health Center (sample)", a: "Barangay hall area, Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" }
      ]},
      { name: "District 4", places: [
        { n: "Rural Health Unit (sample)", a: "Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Peer Support Hub (sample)", a: "Baguio City", t: "Sat, 10:00 AM - 2:00 PM" }
      ]},
      { name: "District 5", places: [
        { n: "Barangay Health Center (sample)", a: "Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Family Wellness Clinic (sample)", a: "Baguio City", t: "Mon-Sat, 9:00 AM - 4:00 PM" }
      ]},
      { name: "District 6", places: [
        { n: "Barangay Health Center (sample)", a: "Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Youth Support Corner (sample)", a: "Baguio City", t: "Wed and Fri, 1:00 PM - 5:00 PM" }
      ]},
      { name: "District 7", places: [
        { n: "Barangay Health Center (sample)", a: "Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Senior Wellness Desk (sample)", a: "Baguio City", t: "Mon, Wed, Fri, 9:00 AM - 12:00 NN" }
      ]},
      { name: "District 8", places: [
        { n: "Barangay Health Center (sample)", a: "Baguio City", t: "Mon-Fri, 8:00 AM - 4:00 PM" },
        { n: "Community Counselling Desk (sample)", a: "Baguio City", t: "Tue and Thu, 9:00 AM - 3:00 PM" }
      ]}
    ];

    var resultsTitle = document.getElementById("results-title");
    var facilityList = document.getElementById("facility-list");
    var bookPlace = document.getElementById("book-place");
    var current = { district: 0, place: 0 };

    function renderFacilities(d) {
      var dist = DATA[d];
      resultsTitle.textContent = dist.name + ": " + dist.places[current.place].n;
      facilityList.innerHTML = "";
      dist.places.forEach(function (p) {
        var art = document.createElement("article");
        art.className = "facility";
        var h = document.createElement("h3"); h.textContent = p.n;
        var a = document.createElement("p"); a.textContent = "Address: " + p.a;
        var t = document.createElement("p"); t.textContent = "Available: " + p.t;
        var img = document.createElement("img");
        img.src = "images/landscape.svg";
        img.alt = "Illustration of green hills and a blue sky representing " + p.n;
        img.width = 280; img.height = 140;
        art.appendChild(h); art.appendChild(a); art.appendChild(t); art.appendChild(img);
        facilityList.appendChild(art);
      });
      bookPlace.textContent = dist.places[current.place].n;
    }

    function buildNav() {
      DATA.forEach(function (dist, i) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.className = "district-btn";
        btn.setAttribute("aria-expanded", i === 0 ? "true" : "false");
        btn.setAttribute("aria-controls", "places-" + i);
        btn.innerHTML = '<span class="chev" aria-hidden="true">&#9656;</span> ' + dist.name;
        var ul = document.createElement("ul");
        ul.className = "place-list"; ul.id = "places-" + i;
        if (i !== 0) ul.hidden = true;
        dist.places.forEach(function (p, j) {
          var pli = document.createElement("li");
          var pb = document.createElement("button");
          pb.textContent = p.n;
          if (i === 0 && j === 0) pb.setAttribute("aria-current", "true");
          pb.addEventListener("click", function () {
            districtNav.querySelectorAll(".place-list button").forEach(function (b) { b.removeAttribute("aria-current"); });
            pb.setAttribute("aria-current", "true");
            current.district = i; current.place = j;
            renderFacilities(i);
          });
          pli.appendChild(pb); ul.appendChild(pli);
        });
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!open));
          ul.hidden = open;
          if (!open) { current.district = i; current.place = 0; renderFacilities(i); }
        });
        li.appendChild(btn); li.appendChild(ul);
        districtNav.appendChild(li);
      });
    }
    buildNav();
    renderFacilities(0);

    /* District search filter */
    var filter = document.getElementById("site-search");
    if (filter) {
      filter.addEventListener("input", function () {
        var q = filter.value.toLowerCase();
        districtNav.querySelectorAll("li").forEach(function (li) {
          if (li.parentElement !== districtNav) return;
          li.hidden = q !== "" && li.textContent.toLowerCase().indexOf(q) === -1;
        });
      });
    }

    /* Calendar */
    var calGrid = document.getElementById("cal-grid");
    var calLabel = document.getElementById("cal-label");
    var today = new Date();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var chosenDate = null, chosenTime = null;
    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    function drawCal() {
      calGrid.innerHTML = "";
      calLabel.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
      ["S","M","T","W","T","F","S"].forEach(function (d) {
        var s = document.createElement("span"); s.className = "dow"; s.textContent = d; calGrid.appendChild(s);
      });
      for (var b = 0; b < view.getDay(); b++) calGrid.appendChild(document.createElement("span"));
      var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= days; d++) {
        (function (day) {
          var date = new Date(view.getFullYear(), view.getMonth(), day);
          var btn = document.createElement("button");
          btn.type = "button"; btn.textContent = day;
          btn.setAttribute("aria-label", MONTHS[date.getMonth()] + " " + day + ", " + date.getFullYear());
          var past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          if (past) btn.disabled = true;
          var isChosen = chosenDate && chosenDate.getTime() === date.getTime();
          btn.setAttribute("aria-pressed", String(!!isChosen));
          btn.addEventListener("click", function () { chosenDate = date; drawCal(); });
          calGrid.appendChild(btn);
        })(d);
      }
    }
    document.getElementById("cal-prev").addEventListener("click", function () { view.setMonth(view.getMonth() - 1); drawCal(); });
    document.getElementById("cal-next").addEventListener("click", function () { view.setMonth(view.getMonth() + 1); drawCal(); });
    drawCal();

    document.querySelectorAll(".times button").forEach(function (tb) {
      tb.addEventListener("click", function () {
        document.querySelectorAll(".times button").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        tb.setAttribute("aria-pressed", "true");
        chosenTime = tb.textContent;
      });
    });

    document.getElementById("make-appt").addEventListener("click", function () {
      var status = document.getElementById("appt-status");
      if (!chosenDate || !chosenTime) {
        status.textContent = "Please choose a date and a time first.";
        return;
      }
      status.textContent = "Request saved for " + MONTHS[chosenDate.getMonth()] + " " + chosenDate.getDate() +
        ", " + chosenDate.getFullYear() + " at " + chosenTime + ". This is a demonstration; no real booking is made.";
    });
  }

  /* ---------- 4. Breathing exercise ---------- */
  var breathBtn = document.getElementById("breath-start");
  var circle = document.getElementById("breath-circle");
  var breathText = document.getElementById("breath-text");
  if (breathBtn && circle) {
    var timer = null, inhale = true;
    function step() {
      inhale = !inhale;
      circle.classList.toggle("expand", inhale);
      breathText.textContent = inhale ? "Breathe in" : "Breathe out";
    }
    breathBtn.addEventListener("click", function () {
      if (timer) {
        clearInterval(timer); timer = null;
        circle.classList.remove("expand");
        breathText.textContent = "Ready";
        breathBtn.textContent = "Start";
        breathBtn.setAttribute("aria-pressed", "false");
      } else {
        inhale = false; step();
        timer = setInterval(step, 4000);
        breathBtn.textContent = "Stop";
        breathBtn.setAttribute("aria-pressed", "true");
      }
    });
  }
})();
