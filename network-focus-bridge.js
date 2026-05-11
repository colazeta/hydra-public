(() => {
  // Network rendering, filtering and focus handling are now owned by app.js.
  // This file is kept as a compatibility shim to avoid loading a second controller.
  function ensureBridgeReady() {
    if (window.HYDRA_NETWORK_BRIDGE) return;
    window.HYDRA_NETWORK_BRIDGE = {
      fit: () => {},
      stabilize: () => {},
      reset: () => {},
      filter: () => {},
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureBridgeReady);
  } else {
    ensureBridgeReady();
  }
})();
