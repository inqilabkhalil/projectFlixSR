(function () {
  "use strict";

  /* ── timers ── */
  var _hideTimer = null;
  var _fadeTimer = null;
  var _rafId = null;
  var _styleInjected = false;
  var _queue = [];
  var _domReady = false;

  /* ── CSS (injected once, only if no existing toast styles found) ── */
  var TOAST_CSS =
    "#appToast{" +
      "position:fixed;top:24px;right:24px;z-index:99999;" +
      "min-width:280px;max-width:400px;" +
      "background:#1e1e2e;color:#fff;" +
      "border-radius:8px;border-left:4px solid #22c55e;" +
      "box-shadow:0 8px 24px rgba(0,0,0,.3);" +
      "display:none;opacity:0;" +
      "font-family:'Raleway',sans-serif;overflow:hidden;" +
    "}" +
    "#appToast.success{border-left-color:#22c55e}" +
    "#appToast.error{border-left-color:#ef4444}" +
    "#appToast.info{border-left-color:#0feffd}" +
    "#appToast .app-toast__text," +
    "#appToast .toast-body," +
    "#appToast #appToastBody," +
    "#appToast #appToastText{padding:14px 16px;font-size:14px}" +
    "#appToast .app-toast__bar," +
    "#appToast .toast-progress{" +
      "height:3px;width:100%;background:#22c55e;" +
    "}" +
    "#appToast.error .app-toast__bar," +
    "#appToast.error .toast-progress{background:#ef4444}" +
    "#appToast.info .app-toast__bar," +
    "#appToast.info .toast-progress{background:#0feffd}";

  function injectStyles() {
    if (_styleInjected) return;
    _styleInjected = true;
    var style = document.createElement("style");
    style.setAttribute("data-toast-styles", "");
    style.textContent = TOAST_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  /* ── Ensure container exists ── */
  function ensureContainer() {
    var toast = document.getElementById("appToast");
    if (toast) return;
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML =
      '<div class="app-toast__text" id="appToastText">Success</div>' +
      '<div class="app-toast__bar" id="appToastBar"></div>';
    document.body.appendChild(toast);
  }

  /* ── Resolve elements ── */
  function getElements() {
    var toast = document.getElementById("appToast");
    if (!toast) return null;

    var text =
      document.getElementById("appToastText") ||
      document.getElementById("appToastBody") ||
      toast.querySelector(".toast-body") ||
      toast.querySelector(".app-toast__text");

    var bar =
      document.getElementById("appToastBar") ||
      toast.querySelector(".toast-progress") ||
      toast.querySelector(".app-toast__bar");

    return { toast: toast, text: text, bar: bar };
  }

  /* ── Timer cleanup ── */
  function resetTimers() {
    if (_hideTimer) { clearTimeout(_hideTimer); _hideTimer = null; }
    if (_fadeTimer) { clearTimeout(_fadeTimer); _fadeTimer = null; }
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  }

  /* ── Core show logic (called only after DOM ready) ── */
  function _showToast(message, type, duration) {
    injectStyles();
    ensureContainer();

    var els = getElements();
    if (!els) return;

    var toast = els.toast;
    var text = els.text;
    var bar = els.bar;

    resetTimers();

    if (text) text.textContent = message;

    toast.classList.remove("success", "error", "info");
    toast.classList.add(type);

    /* Bootstrap Toast path */
    if (window.bootstrap && toast.classList.contains("toast")) {
      var bsToast = bootstrap.Toast.getOrCreateInstance(toast, {
        delay: duration,
        autohide: true,
      });
      bsToast.show();

      if (bar) {
        bar.style.transition = "none";
        bar.style.width = "100%";
        _rafId = requestAnimationFrame(function () {
          bar.style.transition = "width " + duration + "ms linear";
          bar.style.width = "0%";
        });
      }
      return;
    }

    /* Custom toast path */
    toast.style.display = "block";
    toast.style.opacity = "1";
    toast.style.transition = "opacity 0.3s ease";

    if (bar) {
      bar.style.transition = "none";
      bar.style.width = "100%";
      _rafId = requestAnimationFrame(function () {
        bar.style.transition = "width " + duration + "ms linear";
        bar.style.width = "0%";
      });
    }

    _hideTimer = setTimeout(function () {
      toast.style.opacity = "0";
      _fadeTimer = setTimeout(function () {
        toast.style.display = "none";
        toast.classList.remove("success", "error", "info");
      }, 300);
    }, duration);
  }

  /* ── Public API (queues calls if DOM not ready) ── */
  function showToast(message, type, duration) {
    if (type === undefined) type = "success";
    if (duration === undefined) duration = 2500;

    if (!_domReady) {
      _queue.push([message, type, duration]);
      return;
    }
    _showToast(message, type, duration);
  }

  /* ── Flush queue once DOM is ready ── */
  function onReady() {
    _domReady = true;
    while (_queue.length) {
      var args = _queue.shift();
      _showToast(args[0], args[1], args[2]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  /* ── Expose globally (both names for backward compat) ── */
  window.showToast = showToast;
  window.showAppToast = showToast;
})();