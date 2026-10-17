/**
 * 男人的梦想车库 · 共享渲染工具（黑金风 v3）
 * 依赖：data/brands.js + data/cars.js + data.js
 */

var LIB = (function () {
  'use strict';

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

  /** 品牌大文字行（黑金风：无卡片，细线列表） */
  function brandRowHTML(b) {
    var count = getCarCountByBrand(b.id);
    return '<a href="brand.html?brand=' + encodeURIComponent(b.id) + '" class="brand-row fade-up">' +
      '<div><div class="b-name">' + esc(b.name) + '</div>' +
      '<div class="b-en">' + esc(b.name_en || '') + '</div></div>' +
      '<span class="b-count">' + count + ' 款</span>' +
      '</a>';
  }

  /** 车型卡片（黑金风：无边框大图 + 底部信息条） */
  function carCardHTML(c, idx) {
    var img = c.images && c.images[0] ? c.images[0] : '';
    var p = minPrice(c);
    var d = Math.min((idx || 0) % 3, 2);
    var badge = p != null
      ? '<span class="car-price-badge">¥<b>' + esc(p) + '</b> 万起</span>'
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
    initSearch: initSearch,
    brandRowHTML: brandRowHTML,
    carCardHTML: carCardHTML
  };
})();
