(function () {
  var loading = document.getElementById('loading-screen');
  var percentEl = document.getElementById('loading-percent');
  var barFillEl = document.getElementById('loading-barFill');

  // ローディング要素がないページでは何もしない
  if (loading && percentEl && barFillEl) {
    var assetsReady = false;   // フォント＋ページ読み込み完了
    var animDone = false;      // 0→100% のアニメーション完了
    var hideStarted = false;   // フェードアウト開始済みかどうか

    // フォント読み込み状態を取得できる環境なら待つ
    var fontReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    // ページ読み込みが終わったら、フォントもあわせて待つ
    window.addEventListener('load', function () {
      fontReady.then(function () {
        assetsReady = true;
        tryHideLoading();
      });
    });

    // 0→100% の簡易アニメーション
    var duration = 1000; // ミリ秒。ここが「最低見せたい時間」
    var startTime = null;
    var lastPercent = -1;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.floor(progress * 100);

      if (current !== lastPercent) {
        percentEl.textContent = current + '%';
        barFillEl.style.transform = 'scaleX(' + (current / 100) + ')';
        lastPercent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animDone = true;
        tryHideLoading();
      }
    }

    requestAnimationFrame(step);

    // フォント＆ページ読み込み完了＋アニメ完了 → 0.5秒待ってからフェードアウト
    function tryHideLoading() {
      if (!assetsReady || !animDone || hideStarted) return;

      hideStarted = true; // 二重実行防止

      setTimeout(function () {
        loading.classList.add('is-hidden');
      }, 500); // 500ms = 0.5秒待つ
    }
  }

  // ここからアンカーリンクのスムーススクロール
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href === '#') return;

    var id = href.slice(1);
    var target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    var header = document.querySelector('.topbar');
    var headerHeight = header ? header.getBoundingClientRect().height : 0;

    var rect = target.getBoundingClientRect();
    var offsetTop = rect.top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  });
})();
