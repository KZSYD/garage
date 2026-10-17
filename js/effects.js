/**
 * 男人的梦想车库 · 视觉特效引擎
 * 粒子星空 / 光标光晕 / 流星 / 加载屏 / 网格与扫描线 /
 * 3D 倾斜 / 卡片光斑 / 数字滚动 / 图库闪白
 * 用法：各页面引入本文件，动态渲染完成后调用 FX.refresh()
 */
(function () {
  'use strict';
  if (window.FX) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Loading 屏（立即注入防闪烁） ================= */
  var loader = null;
  (function initLoader() {
    if (reduced) return;
    loader = document.createElement('div');
    loader.className = 'fx-loader';
    loader.innerHTML =
      '<div class="fx-loader-inner">' +
      '  <div class="fx-loader-mark"></div>' +
      '  <div class="fx-loader-text">男人的梦想车库</div>' +
      '  <div class="fx-loader-bar"><div class="fx-loader-fill"></div></div>' +
      '</div>';
    document.documentElement.appendChild(loader);
    var fill = loader.querySelector('.fx-loader-fill');
    var prog = 0;
    var minTime = Date.now() + 1100;
    var iv = setInterval(function () {
      prog += 6 + Math.random() * 13;
      if (prog >= 100) {
        prog = 100; clearInterval(iv);
        var wait = Math.max(0, minTime - Date.now());
        setTimeout(function () {
          loader.classList.add('done');
          setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 650);
        }, wait + 200);
      }
      if (fill) fill.style.width = prog + '%';
    }, 90);
  })();

  /* ================= 背景层注入 ================= */
  (function initBackdrop() {
    if (reduced) return;
    var grid = document.createElement('div');
    grid.className = 'fx-grid';
    document.body.appendChild(grid);
    var scan = document.createElement('div');
    scan.className = 'fx-scanline';
    document.body.appendChild(scan);
  })();

  /* ================= 粒子星空 ================= */
  var parts = [], mouse = { x: -9999, y: -9999 }, W = 0, H = 0;

  function spawn(anywhere) {
    var colors = ['46,107,255', '216,169,78', '240,198,116', '158,178,214'];
    return {
      x: anywhere ? Math.random() * W : -20,
      y: anywhere ? Math.random() * H : H + 20,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.1 + Math.random() * 0.35),
      r: 0.6 + Math.random() * 1.6,
      c: colors[(Math.random() * colors.length) | 0],
      a: 0.25 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
      tws: 0.008 + Math.random() * 0.02
    };
  }

  function initParticles() {
    if (reduced) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'fx-particles';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var target = Math.min(110, Math.round(W * H / 16000));
      while (parts.length < target) parts.push(spawn(true));
      if (parts.length > target) parts.length = target;
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          var d = Math.sqrt(d2) || 1;
          var f = (150 - d) / 150 * 0.02;
          p.x += dx / d * f * 8;
          p.y += dy / d * f * 8;
        }
        p.x += p.vx; p.y += p.vy; p.tw += p.tws;
        if (p.y < -20 || p.x < -20 || p.x > W + 20) parts[i] = spawn(false);
        var alpha = p.a * (0.75 + 0.25 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + alpha.toFixed(3) + ')';
        ctx.fill();
        if (p.r > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.c + ',' + (alpha * 0.12).toFixed(3) + ')';
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(tick);
  }

  /* ================= 光标光晕 ================= */
  function initSpotlight() {
    if (reduced) return;
    var d = document.createElement('div');
    d.id = 'fx-spot';
    document.body.appendChild(d);
    window.addEventListener('mousemove', function (e) {
      d.style.transform = 'translate(' + (e.clientX - 300) + 'px,' + (e.clientY - 300) + 'px)';
    });
  }

  /* ================= 流星 ================= */
  function initShooting() {
    if (reduced) return;
    function shoot() {
      var s = document.createElement('div');
      s.className = 'fx-meteor';
      s.style.top = (6 + Math.random() * 32) + '%';
      s.style.left = (55 + Math.random() * 45) + '%';
      s.style.animationDuration = (1.3 + Math.random() * 1.2) + 's';
      document.body.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 3200);
    }
    function loop() {
      setTimeout(function () {
        if (Math.random() < 0.6) shoot();
        loop();
      }, 3600 + Math.random() * 3200);
    }
    setTimeout(loop, 2500);
  }

  /* ================= 3D 倾斜 ================= */
  function bindTilt(el) {
    if (reduced || !el || el._fxTilt) return;
    el._fxTilt = true;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(900px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 8).toFixed(2) + 'deg)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ================= 卡片光斑跟随 ================= */
  function bindGlow(el) {
    if (reduced || !el || el._fxGlow) return;
    el._fxGlow = true;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ================= 数字滚动 ================= */
  function countUp(el, target, dur) {
    if (isNaN(target) || target == null) return;
    var dec = (String(target).split('.')[1] || '').length;
    var t0 = null; dur = dur || 1700;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function bindCounter(el) {
    if (reduced || !el || el._fxCount) return;
    el._fxCount = true;
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        countUp(el, target, 1800);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
  }

  /* ================= 刷新（动态渲染后调用） ================= */
  function refresh() {
    var tilts = document.querySelectorAll('[data-tilt]');
    for (var i = 0; i < tilts.length; i++) bindTilt(tilts[i]);
    var glows = document.querySelectorAll('[data-glow]');
    for (var j = 0; j < glows.length; j++) bindGlow(glows[j]);
    var counts = document.querySelectorAll('[data-count]');
    for (var k = 0; k < counts.length; k++) bindCounter(counts[k]);
  }

  window.FX = {
    refresh: refresh,
    countUp: countUp,
    initParticles: initParticles,
    initSpotlight: initSpotlight,
    initShooting: initShooting
  };

  /* ================= 启动 ================= */
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initSpotlight();
    initShooting();
    refresh();
  });
})();
