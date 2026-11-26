/* AnnMarie theme — small, dependency-free interactions. */
(function () {
  'use strict';

  /* ---------- Quantity steppers ---------- */
  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-qty]');
    if (!btn) return;
    var input = btn.parentElement.querySelector('input[type="number"]');
    if (!input) return;
    var min = parseInt(input.min || '0', 10);
    var next = (parseInt(input.value, 10) || 0) + parseInt(btn.dataset.qty, 10);
    input.value = Math.max(min, next);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- Product page: size tabs ---------- */
  document.querySelectorAll('[data-product]').forEach(function (product) {
    var tabs = product.querySelectorAll('[data-size-tab]');
    var offers = product.querySelectorAll('[data-offer]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var size = tab.dataset.sizeTab;
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
        offers.forEach(function (offer) { offer.hidden = offer.dataset.size !== size; });
      });
    });

    /* ---------- Add to basket without leaving the page ---------- */
    var status = product.querySelector('[data-status]');
    product.querySelectorAll('[data-add-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var button = form.querySelector('[type="submit"]');
        if (button) button.disabled = true;
        fetch(window.routes.cart_add_url + '.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        })
          .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
          .then(function (result) {
            if (!result.ok) throw new Error(result.data.description || result.data.message);
            if (status) status.textContent = status.dataset.added || 'Added to your basket.';
            return refreshCartCount();
          })
          .catch(function (err) {
            if (status) status.textContent = err.message || 'Could not add to basket.';
          })
          .finally(function () { if (button) button.disabled = false; });
      });
    });
  });

  function refreshCartCount() {
    return fetch(window.routes.cart_url + '.js', { headers: { Accept: 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count > 0 ? cart.item_count : '';
        });
      });
  }

  /* ---------- Featured wines carousel ---------- */
  document.querySelectorAll('[data-featured-wines]').forEach(function (root) {
    var track = root.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    if (!track || slides.length === 0) return;

    function centerOn(slide, smooth) {
      var left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
      track.scrollTo({ left: left, behavior: smooth ? 'smooth' : 'auto' });
    }

    function setActive() {
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = slides[0];
      var bestDist = Infinity;
      slides.forEach(function (s) {
        var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = s; }
      });
      slides.forEach(function (s) { s.classList.toggle('is-active', s === best); });
    }

    slides.forEach(function (slide) {
      slide.addEventListener('click', function (event) {
        if (!slide.classList.contains('is-active')) {
          event.preventDefault();
          centerOn(slide, true);
        }
      });
    });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { setActive(); ticking = false; });
    }, { passive: true });

    // Start on the second wine so one bottle peeks in on each side, as in the design.
    centerOn(slides[Math.min(1, slides.length - 1)], false);
    setActive();
    window.addEventListener('resize', function () {
      var active = root.querySelector('.is-active') || slides[0];
      centerOn(active, false);
    });
  });
})();
