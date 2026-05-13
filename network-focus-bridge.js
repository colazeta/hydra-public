(() => {
  // compatibility shim: keeps HYDRA_NETWORK_BRIDGE methods available even before app.js initializes.
  const noop = () => {};

  function ensureBridge() {
    const current = window.HYDRA_NETWORK_BRIDGE || {};
    window.HYDRA_NETWORK_BRIDGE = {
      fit: typeof current.fit === 'function' ? current.fit : noop,
      stabilize: typeof current.stabilize === 'function' ? current.stabilize : noop,
      reset: typeof current.reset === 'function' ? current.reset : noop,
      filter: typeof current.filter === 'function' ? current.filter : noop,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureBridge);
  } else {
    ensureBridge();
  }

  const observer = new MutationObserver(() => ensureBridge());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
