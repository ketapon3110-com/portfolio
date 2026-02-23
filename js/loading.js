(function () {
  var loading = document.getElementById('loading-screen');
  if (!loading) return;

  // フォント読み込み完了を待てる場合はそれも考慮
  var fontReady = (document.fonts && document.fonts.ready)
    ? document.fonts.ready
    : Promise.resolve();

  // 画面の読み込み完了も待っておく
  window.addEventListener('load', function () {
    // フォント読み込みと合わせて最短でも1秒は見せる
    var minDelay = new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });

    Promise.all([fontReady, minDelay]).then(function () {
      loading.classList.add('is-hidden');
    });
  });
})();
