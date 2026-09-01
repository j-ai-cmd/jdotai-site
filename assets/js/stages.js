/* Stage activation — numerals go grey to wine, sweep reveals the text.
 *
 * The sweep hides text until a stage is marked live, so the reveal must be
 * fail-safe: if IntersectionObserver is missing, throttled (hidden/background
 * tab), or simply never fires, everything is revealed anyway. Content is never
 * allowed to stay hidden.
 */
(function () {
  var stages = document.querySelectorAll('.stage');
  if (!stages.length) return;

  function revealAll() {
    stages.forEach(function (s) { s.classList.add('live'); });
  }

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('live');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

  stages.forEach(function (s) { io.observe(s); });

  // Failsafe: anything still hidden shortly after load gets revealed outright.
  setTimeout(function () {
    var stuck = document.querySelectorAll('.stage:not(.live)');
    if (stuck.length === stages.length) revealAll();
  }, 1600);
})();
