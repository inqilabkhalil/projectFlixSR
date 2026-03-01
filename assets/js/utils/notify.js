/**
 * notify.js — iziToast wrapper
 * Exposes: notifySuccess, notifyError, notifyInfo, notifyWarning, notifyConfirm
 */
(function () {
  "use strict";

  /* ── Default settings (applied once) ── */
  if (typeof iziToast !== "undefined") {
    iziToast.settings({
      timeout: 3000,
      position: "topRight",
      resetOnHover: true,
      transitionIn: "fadeInDown",
      transitionOut: "fadeOutUp",
    });
  }

  /* ── Helpers ── */
  function notifySuccess(message, title) {
    iziToast.success({
      title: title || "Success",
      message: message || "",
    });
  }

  function notifyError(message, title) {
    iziToast.error({
      title: title || "Error",
      message: message || "",
    });
  }

  function notifyInfo(message, title) {
    iziToast.info({
      title: title || "Info",
      message: message || "",
    });
  }

  function notifyWarning(message, title) {
    iziToast.warning({
      title: title || "Warning",
      message: message || "",
    });
  }

  /**
   * Confirm dialog (for delete etc.)
   * notifyConfirm({ title, message, onYes, onNo })
   */
  function notifyConfirm(opts) {
    var title = (opts && opts.title) || "Confirm";
    var message = (opts && opts.message) || "Are you sure?";
    var onYes = (opts && opts.onYes) || function () {};
    var onNo = (opts && opts.onNo) || function () {};

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: "once",
      id: "confirmDialog",
      zindex: 99999,
      title: title,
      message: message,
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOutUp" }, toast, "button");
            onYes();
          },
          true,
        ],
        [
          "<button>No</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOutUp" }, toast, "button");
            onNo();
          },
        ],
      ],
    });
  }

  /* ── Backward compat shim: showToast / showAppToast → iziToast ── */
  function showToastShim(message, type, _duration) {
    switch (type) {
      case "error":
        notifyError(message);
        break;
      case "info":
        notifyInfo(message);
        break;
      case "warning":
        notifyWarning(message);
        break;
      default:
        notifySuccess(message);
    }
  }

  /* ── Expose globally ── */
  window.notifySuccess = notifySuccess;
  window.notifyError = notifyError;
  window.notifyInfo = notifyInfo;
  window.notifyWarning = notifyWarning;
  window.notifyConfirm = notifyConfirm;

  // backward compat aliases (to catch any missed calls)
  window.showToast = showToastShim;
  window.showAppToast = showToastShim;
})();
