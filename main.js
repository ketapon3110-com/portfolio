(function () {
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // 開いたら先頭スライドへ
    var deck = el.querySelector("[data-deck]");
    if (deck) deck.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeModal() {
    var open = document.querySelector('.modal[aria-hidden="false"]');
    if (!open) return;
    open.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function getOpenDeck() {
    var open = document.querySelector('.modal[aria-hidden="false"]');
    if (!open) return null;
    return open.querySelector("[data-deck]");
  }

  function scrollDeckBy(dir) {
    var deck = getOpenDeck();
    if (!deck) return;
    var slides = Array.prototype.slice.call(deck.querySelectorAll(".deckSlide"));
    if (!slides.length) return;

    var top = deck.scrollTop;
    var currentIndex = 0;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].offsetTop <= top + 8) currentIndex = i;
    }
    var next = Math.max(0, Math.min(slides.length - 1, currentIndex + dir));
    deck.scrollTo({ top: slides[next].offsetTop, behavior: "smooth" });
  }

  document.addEventListener("click", function (e) {
    var t = e.target;

    var openBtn = t && t.closest ? t.closest("[data-open-modal]") : null;
    if (openBtn) {
      var id = openBtn.getAttribute("data-open-modal");
      openModal(id);
      return;
    }

    var closeBtn = t && t.closest ? t.closest("[data-close-modal]") : null;
    if (closeBtn) {
      closeModal();
      return;
    }

    var prev = t && t.closest ? t.closest("[data-deck-prev]") : null;
    if (prev) {
      scrollDeckBy(-1);
      return;
    }

    var next = t && t.closest ? t.closest("[data-deck-next]") : null;
    if (next) {
      scrollDeckBy(1);
      return;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowDown") scrollDeckBy(1);
    if (e.key === "ArrowUp") scrollDeckBy(-1);
  });
})();
