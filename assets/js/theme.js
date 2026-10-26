(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  function sync() {
    var light = root.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    if (meta) meta.setAttribute('content', light ? '#FBFBF8' : '#0A0A0A');
  }

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private window: not remembered */ }
    sync();
  });
  sync();
})();
