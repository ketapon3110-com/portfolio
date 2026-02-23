(function () {
  var loading = document.getElementById('loading-screen');
  var percentEl = document.getElementById('loading-percent');
  var barFillEl = document.getElementById('loading-barFill');

  if (loading && percentEl && barFillEl) {
    var assetsReady = false;   // フォント＋ページ読み込み完了
    var animDone = false;      // 0→100% のアニメーション完了
    var hideStarted = false;

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
    var lastPercent = 0;

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

    // 両方そろったらローディングを消す
    function tryHideLoading() {
      if (!assetsReady || !animDone || hideStarted) return;

      hideStarted = true;

      setTimeout(function () {
        loading.classList.add('is-hidden');
      }, 500);
  }

  // ここからアンカーリンクのスムーススクロール
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    // href="#" は無視
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
