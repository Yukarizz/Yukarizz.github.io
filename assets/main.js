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

  /* ---- live citation data ----
     GitHub Actions 每天抓取引用数据，写入 scholar-data 分支的 data/scholar.json，
     这里拉取后更新页面数字。拉取失败就沿用页面里写死的数值，不影响展示。 */
  var DATA_URL = 'https://raw.githubusercontent.com/Yukarizz/Yukarizz.github.io/'
               + 'scholar-data/data/scholar.json';

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value !== null && value !== undefined) el.textContent = value;
  }

  function updateCitations(data) {
    if (!data) return;
    setText('m-citations', data.citations);
    setText('m-hindex', data.hindex);
    setText('m-i10index', data.i10index);
    if (data.papers) setText('m-pubcount', Object.keys(data.papers).length);

    pubs.forEach(function (p) {
      var doi = p.getAttribute('data-doi');
      if (!doi || !data.papers) return;
      var n = data.papers[doi];
      if (n === undefined || n === null) return;
      var badge = p.querySelector('.b-cite');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge b-cite';
        var venue = p.querySelector('.p-venue');
        if (venue) venue.appendChild(badge); else return;
      }
      badge.textContent = 'Cited ' + n;
      badge.hidden = (n === 0);
    });

    var note = document.getElementById('cite-note');
    if (note && data.updated) {
      var d = data.updated.slice(0, 10);
      var src = data.source === 'google-scholar' ? 'Google Scholar'
              : (data.source || '').indexOf('serpapi') > -1 ? 'Google Scholar'
              : data.source === 'semantic-scholar' ? 'Semantic Scholar'
              : data.source === 'crossref' ? 'Crossref' : data.source;
      var txt = 'Citation data: ' + src + ' · updated ' + d;
      note.textContent = txt;
      // 顶部指标区也标注数据来源，避免与 Google Scholar 主页的数字混淆
      var metrics = document.querySelector('.metrics');
      if (metrics) metrics.title = txt;
    }
  }

  fetch(DATA_URL, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(updateCitations)
    .catch(function () { /* 拿不到就保留写死的数值 */ });
})();
