/* Publication filtering + scroll-spy for the sticky nav */

(function () {
  'use strict';

  var pubs = Array.prototype.slice.call(document.querySelectorAll('#publist .pub'));
  var yearBtns = Array.prototype.slice.call(document.querySelectorAll('#filter-year .fbtn'));
  var firstBox = document.getElementById('filter-first');

  var year = 'all';

  function apply() {
    var firstOnly = firstBox && firstBox.checked;
    pubs.forEach(function (p) {
      var okYear = year === 'all' || p.getAttribute('data-year') === year;
      var okFirst = !firstOnly || p.getAttribute('data-first') === '1';
      p.hidden = !(okYear && okFirst);
    });
  }

  yearBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      yearBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      year = btn.getAttribute('data-f');
      apply();
    });
  });

  if (firstBox) firstBox.addEventListener('change', apply);

  /* ---- scroll-spy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('#toc a'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function spy() {
    var pos = window.scrollY + 90;
    var current = targets[0];
    targets.forEach(function (t) {
      if (t.offsetTop <= pos) current = t;
    });
    links.forEach(function (a) {
      var on = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', !!on);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { spy(); ticking = false; });
  }, { passive: true });

  spy();
})();
