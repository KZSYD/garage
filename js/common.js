/**
 * 铃铛的车库 · 共享渲染工具
 * 依赖：data/brands.js + data/cars.js + data.js
 */

var LIB = (function () {
  'use strict';

  var FEATURED = ['xiaomi-su7', 'tesla-cybertruck', 'nio-et9', 'byd-u8', 'xpeng-x9', 'lixiang-mega'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** 取车型起售价（解析 trims 里第一个数字） */
  function startPrice(car) {
    if (!car.trims || !car.trims.length) return null;
    var m = String(car.trims[0].price).match(/[\d.]+/);
    return m ? m[0] : null;
  }

  function minPrice(car) {
    var nums = [];
    if (car.trims && car.trims.length) {
      car.trims.forEach(function (t) {
        var m = String(t.price).match(/[\d.]+/g);
        if (m) { for (var i = 0; i < m.length; i++) nums.push(parseFloat(m[i])); }
      });
    }
    return nums.length ? Math.min.apply(null, nums) : null;
  }

  function numOrNull(v) {
    var m = String(v == null ? '' : v).match(/[\d.]+/);
    return m ? parseFloat(m[0]) : null;
  }

  /** 首页 Hero 轮播 */
  function initHero() {
    var stage = document.getElementById('hero-card');
    if (!stage) return;

    var ids = FEATURED.filter(function (id) { return getCarById(id); });
    if (!ids.length) { stage.style.display = 'none'; return; }

    var cur = 0, timer = null;

    function render(i) {
      var car = getCarById(ids[i]);
      var brand = getBrandById(car.brand_id);
      var img = car.images && car.images[0] ? car.images[0] : '';
      var p = startPrice(car);
      stage.innerHTML =
        '<div class="hero-img-wrap">' +
        (img ? '<img src="' + esc(img) + '" alt="' + esc(car.name) + '" onerror="this.parentNode.innerHTML=\'<div class=\\\'no-img\\\'>暂无图片</div>\'">' : '<div class="no-img">暂无图片</div>') +
        '</div>' +
        '<div class="hero-info">' +
        '<div><div class="h-name">' + esc(brand ? brand.name + ' ' + car.name : car.name) + '</div>' +
        '<div class="h-meta">' + esc(car.year + ' · ' + (car.type || '')) +
        (p ? ' · ' + esc(p) + '万起' : '') + '</div></div>' +
        '<a class="h-go" href="car.html?id=' + encodeURIComponent(car.id) + '">查看详情 →</a>' +
        '</div>';

      var dots = stage.parentNode.querySelectorAll('.hero-dots button');
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d === i);
      }
    }

    // 圆点
    var dotsWrap = document.getElementById('hero-dots');
    var dotsHtml = '';
    for (var i = 0; i < ids.length; i++) {
      dotsHtml += '<button data-i="' + i + '" aria-label="第' + (i + 1) + '辆"></button>';
    }
    dotsWrap.innerHTML = dotsHtml;

    function go(i, dir) {
      var next = (i + ids.length) % ids.length;
      stage.classList.add('switching');
      setTimeout(function () {
        cur = next;
        render(cur);
        stage.classList.remove('switching');
      }, 260);
      restart();
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(cur, 1); }, 5000);
    }

    dotsWrap.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var i = parseInt(b.getAttribute('data-i'), 10);
      if (i !== cur) go(i, 1);
    });

    var prev = stage.parentNode.querySelector('.hero-arrow.prev');
    var next = stage.parentNode.querySelector('.hero-arrow.next');
    if (prev) prev.addEventListener('click', function () { go(cur, -1); });
    if (next) next.addEventListener('click', function () { go(cur, 1); });

    render(0);
    restart();
  }

  /** 全局导航搜索框（跳到 search.html） */
  function initSearch() {
    var input = document.querySelector('.nav-search input');
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  }

  /** 品牌卡片 */
  function brandCardHTML(b) {
    var count = getCarCountByBrand(b.id);
    var logo = b.logo
      ? '<img src="' + esc(b.logo) + '" alt="' + esc(b.name) + '" onload="this.previousElementSibling.style.display=\'none\'" onerror="this.style.display=\'none\'">'
      : '';
    return '<a href="brand.html?brand=' + encodeURIComponent(b.id) + '" class="brand-card fade-up">' +
      '<div class="brand-logo"><span>' + esc(b.name.charAt(0)) + '</span>' + logo + '</div>' +
      '<div class="brand-name">' + esc(b.name) + '</div>' +
      '<div class="brand-name-en">' + esc(b.name_en || '') + '</div>' +
      '<span class="brand-count">' + count + ' 款车型</span>' +
      '</a>';
  }

  /** 车型卡片 */
  function carCardHTML(c, idx) {
    var brand = getBrandById(c.brand_id);
    var img = c.images && c.images[0] ? c.images[0] : '';
    var p = minPrice(c);
    var d = Math.min((idx || 0) % 3, 2);
    var badge = p != null
      ? '<span class="car-price-badge">最低 <b>' + esc(p) + '</b> 万起</span>'
      : '';
    return '<a href="car.html?id=' + encodeURIComponent(c.id) + '" class="car-card fade-up d' + d + '">' +
      badge +
      '<div class="car-image">' +
      (img ? '<img src="' + esc(img) + '" alt="' + esc(c.name) + '" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=\\\'no-img\\\'>暂无图片</div>\'">' : '<div class="no-img">暂无图片</div>') +
      '</div>' +
      '<div class="car-info">' +
      '<div class="car-name">' + esc(c.name) + (c.sub_name ? ' ' + esc(c.sub_name) : '') + '</div>' +
      '<div class="car-name-en">' + esc(c.name_en || '') + '</div>' +
      '<div class="car-meta">' + esc(c.year || '') + ' · ' + esc(c.type || '') + '</div>' +
      '<span class="car-go">查看详情 →</span>' +
      '</div>' +
      '</a>';
  }

  return {
    esc: esc,
    startPrice: startPrice,
    minPrice: minPrice,
    numOrNull: numOrNull,
    initHero: initHero,
    initSearch: initSearch,
    brandCardHTML: brandCardHTML,
    carCardHTML: carCardHTML
  };
})();
