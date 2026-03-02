/**
 * Global Loading Overlay  –  SpinKit sk-circle
 * ───────────────────────────────────────────────
 * Auto-injects the overlay HTML and monkey-patches
 * window.fetch so every network request shows/hides
 * the spinner automatically.
 *
 * Public API:
 *   showLoader()   –  display the overlay
 *   hideLoader()   –  hide   the overlay
 */
(function () {
  "use strict";

  /* ── 1. Inject overlay HTML ───────────────────── */
  const overlay = document.createElement("div");
  overlay.className = "loader-overlay";
  overlay.id = "loaderOverlay";
  overlay.innerHTML = `
    <div class="sk-circle">
      <div class="sk-child sk-circle1"></div>
      <div class="sk-child sk-circle2"></div>
      <div class="sk-child sk-circle3"></div>
      <div class="sk-child sk-circle4"></div>
      <div class="sk-child sk-circle5"></div>
      <div class="sk-child sk-circle6"></div>
      <div class="sk-child sk-circle7"></div>
      <div class="sk-child sk-circle8"></div>
      <div class="sk-child sk-circle9"></div>
      <div class="sk-child sk-circle10"></div>
      <div class="sk-child sk-circle11"></div>
      <div class="sk-child sk-circle12"></div>
    </div>`;
  document.body.appendChild(overlay);

  /* ── 2. Show / Hide helpers ───────────────────── */
  let activeRequests = 0;

  function showLoader() {
    overlay.classList.add("active");
  }

  function hideLoader() {
    overlay.classList.remove("active");
  }

  /* ── 3. Monkey-patch fetch ────────────────────── */
  const originalFetch = window.fetch;

  window.fetch = function () {
    activeRequests++;
    showLoader();

    return originalFetch
      .apply(this, arguments)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        throw error;
      })
      .finally(function () {
        activeRequests--;
        if (activeRequests <= 0) {
          activeRequests = 0;
          hideLoader();
        }
      });
  };

  /* ── 4. Expose globally ───────────────────────── */
  window.showLoader = showLoader;
  window.hideLoader = hideLoader;
})();
