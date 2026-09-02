/* Shared page behaviour: stage reveal, counting figures, read progress,
 * nav inversion over the dark band.
 *
 * Everything here is enhancement. If this file never runs, the page is
 * complete and readable — figures render their real values in the markup and
 * the sweep overlay is scoped to .js, which only exists once script runs.
 */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ── stages ─────────────────────────────────────────────── */
  var stages = document.querySelectorAll('.stage');

  // Reveal any stage that is actually within the viewport. This is the
  // correctness backstop: it never reveals a stage the reader has not
  // reached, so it cannot flatten the effect the way a blanket timeout does.
  function revealVisible() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    stages.forEach(function (s) {
      if (s.classList.contains('live')) return;
      var r = s.getBoundingClientRect();
      if (r.top < h * 0.85 && r.bottom > 0) s.classList.add('live');
    });
  }

  if (stages.length) {
    if (hasIO) {
      var stageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('live');
            stageObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
      stages.forEach(function (s) { stageObserver.observe(s); });
    }

    // Runs with or without IntersectionObserver, so a throttled or missing
    // observer degrades to a plain scroll check rather than to hidden text.
    var pending = false;
    function onScroll() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { revealVisible(); pending = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    revealVisible();
  }

  /* ── counting figures ───────────────────────────────────── */
  var figures = document.querySelectorAll('.n[data-to]');

  function count(el) {
    var target = Number(el.getAttribute('data-to'));
    if (!Number.isFinite(target)) return;

    // The real value is already in the markup. Only ever replace it with an
    // in-progress value while we are certain the animation is running; if the
    // tab is hidden, motion is reduced, or frames stall, the true number stands.
    if (reduced || document.visibilityState !== 'visible') {
      el.textContent = target;
      return;
    }

    var duration = 700, start = null, done = false;
    function settle() { if (!done) { done = true; el.textContent = target; } }

    // Whatever happens to the frame loop, the correct number is written.
    var guard = setTimeout(settle, duration + 400);

    function frame(now) {
      if (done) return;
      if (start === null) start = now;
      var k = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) { requestAnimationFrame(frame); }
      else { clearTimeout(guard); settle(); }
    }
    requestAnimationFrame(frame);
  }

  if (figures.length && hasIO && !reduced) {
    var figureObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { count(e.target); figureObserver.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    figures.forEach(function (n) { figureObserver.observe(n); });
  }

  /* ── read progress in the nav pill ──────────────────────── */
  var pill = document.getElementById('pill');

  if (pill && !reduced) {
    var ticking = false;
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      pill.style.setProperty('--read', (pct / 100).toFixed(4));
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }


  /* ── post lists ─────────────────────────────────────────── */
  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // A post is only linkable once its page exists. Unpublished entries render as
  // plain items so the site never ships a link to a page that isn't there.
  function renderPosts(mount, list) {
    if (!mount) return;
    mount.innerHTML = '';
    list.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'card' + (p.published ? '' : ' card--scheduled');

      var inner = p.published
        ? document.createElement('a')
        : document.createElement('div');
      if (p.published) inner.href = '/blog/' + p.slug + '/';
      inner.className = 'card-in';

      var h = document.createElement('h3');
      h.textContent = p.title;

      var meta = document.createElement('p');
      meta.className = 'card-meta';
      meta.textContent = (p.published ? '' : 'Scheduled — ') + formatDate(p.date)
        + (p.published && p.category ? ' · ' + p.category : '');

      inner.appendChild(h);
      inner.appendChild(meta);
      li.appendChild(inner);
      mount.appendChild(li);
    });
  }

  renderPosts(document.getElementById('latest-posts'), posts.slice(0, 3));
  renderPosts(document.getElementById('all-posts'), posts);


  /* ── invert the pill while a dark band sits behind it ───── */
  var bands = document.querySelectorAll('.band');

  if (pill && bands.length && hasIO) {
    // The pill's own band: a thin strip at the top of the viewport where it sits.
    var bandObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        pill.classList.toggle('over-dark', e.isIntersecting);
      });
    }, { rootMargin: '-2rem 0px -88% 0px', threshold: 0 });
    bands.forEach(function (b) { bandObserver.observe(b); });
  }
})();
