(function () {
  var canvas = document.getElementById('globe');
  if (!canvas) return;

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var tilt = 22 * Math.PI / 180;
  var rot = 59;

  function vec(lat, lon) {
    lat *= Math.PI / 180; lon *= Math.PI / 180;
    return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
  }

  var home = vec(30.04, 31.24); // Cairo
  var cities = [
    [51.5, -0.1], [40.7, -74], [25.2, 55.3], [24.7, 46.7], [52.5, 13.4], [1.35, 103.8],
    [43.7, -79.4], [6.5, 3.4], [-33.9, 18.4], [48.9, 2.35], [35.7, 139.7], [-1.3, 36.8],
    [55.8, 37.6], [19.1, 72.9], [41.0, 29.0], [-23.5, -46.6], [37.6, -122.4]
  ].map(function (c) { return vec(c[0], c[1]); });
  var land = [];

  fetch(canvas.getAttribute('data-land'))
    .then(function (r) { return r.json(); })
    .then(function (a) {
      for (var i = 0; i < a.length; i += 2) land.push(vec(a[i], a[i + 1]));
    })
    .catch(function () {});

  function project(p) {
    var th = rot * Math.PI / 180, ct = Math.cos(th), st = Math.sin(th);
    var x1 = p[0] * ct - p[2] * st, z1 = p[0] * st + p[2] * ct;
    var cf = Math.cos(tilt), sf = Math.sin(tilt);
    return [-x1, p[1] * cf - z1 * sf, p[1] * sf + z1 * cf];
  }

  function draw(t) {
    var w = canvas.clientWidth;
    if (!w) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
    }
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, w);

    var cx = w / 2, cy = w / 2, R = w * 0.42;
    var glow = g.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    glow.addColorStop(0, 'rgba(255,255,255,0.07)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, R * 1.25, 0, Math.PI * 2); g.fill();

    var body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, '#1A1A1A');
    body.addColorStop(1, '#0B0B0B');
    g.fillStyle = body; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 1; g.stroke();

    var scale = Math.max(1, w / 520);
    for (var i = 0; i < land.length; i++) {
      var q = project(land[i]);
      if (q[2] <= 0) continue;
      g.fillStyle = 'rgba(255,255,255,' + (0.15 + 0.8 * q[2]).toFixed(3) + ')';
      var s = (0.6 + 1.1 * q[2]) * scale;
      g.fillRect(cx + q[0] * R - s / 2, cy - q[1] * R - s / 2, s, s);
    }

    cities.forEach(function (b, k) {
      var period = 5200, ph = ((t + k * 470) % period) / period;
      var head = Math.min(1, ph / 0.55), tail = Math.max(0, (ph - 0.45) / 0.55);
      var dot = home[0] * b[0] + home[1] * b[1] + home[2] * b[2];
      var om = Math.acos(Math.max(-1, Math.min(1, dot))), so = Math.sin(om) || 1;
      var pen = false, endP = null;
      g.beginPath();
      for (var j = 0; j <= 40; j++) {
        var u = tail + (head - tail) * (j / 40);
        var a1 = Math.sin((1 - u) * om) / so, a2 = Math.sin(u * om) / so;
        var lift = 1 + 0.18 * Math.sin(Math.PI * u) * om;
        var p = [
          (a1 * home[0] + a2 * b[0]) * lift,
          (a1 * home[1] + a2 * b[1]) * lift,
          (a1 * home[2] + a2 * b[2]) * lift
        ];
        var pq = project(p);
        var vis = pq[2] > -0.05 || (pq[0] * pq[0] + pq[1] * pq[1]) > 1;
        var sx = cx + pq[0] * R, sy = cy - pq[1] * R;
        if (vis) { if (pen) g.lineTo(sx, sy); else { g.moveTo(sx, sy); pen = true; } } else pen = false;
        if (j === 40) endP = vis && tail < 0.6 ? [sx, sy, head < 1] : null;
      }
      g.strokeStyle = 'rgba(224,237,52,0.6)'; g.lineWidth = 1; g.stroke();
      if (endP) {
        g.fillStyle = '#E0ED34'; g.beginPath();
        g.arc(endP[0], endP[1], endP[2] ? 1.6 : 1.8, 0, Math.PI * 2); g.fill();
      }
    });

    var hq = project(home);
    if (hq[2] > 0) {
      var hx = cx + hq[0] * R, hy = cy - hq[1] * R, sc = Math.max(1, w / 560);
      var pr = (t % 2600) / 2600;
      g.strokeStyle = 'rgba(224,237,52,' + (0.6 * (1 - pr)).toFixed(3) + ')'; g.lineWidth = 1;
      g.beginPath(); g.arc(hx, hy, (3.5 + pr * 14) * sc, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#E0ED34'; g.beginPath(); g.arc(hx, hy, 3.2 * sc, 0, Math.PI * 2); g.fill();
    }
  }

  var last = performance.now(), elapsed = 0;
  function loop(t) {
    var dt = Math.min(64, t - last); last = t;
    if (!reduce) { elapsed += dt; rot = 59 + 40 * Math.sin(elapsed * 0.00016); }
    draw(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
