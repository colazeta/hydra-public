(() => {
  function readGlobal(name) {
    try {
      // Top-level let/function bindings from app.js are global lexical bindings.
      // Direct eval lets this bridge read them without requiring app.js to attach them to window.
      return eval(name);
    } catch (_error) {
      return undefined;
    }
  }

  function getNetworkInstance() {
    return readGlobal('HYDRA_NETWORK_INSTANCE') || window.HYDRA_NETWORK_INSTANCE || null;
  }

  function getNetworkData() {
    return readGlobal('HYDRA_NETWORK_DATA') || window.HYDRA_NETWORK_DATA || { nodes: [], edges: [] };
  }

  function getFocusRenderer() {
    const candidate = readGlobal('focusNetworkNode');
    return typeof candidate === 'function' ? candidate : null;
  }

  function focusNode(nodeId) {
    const network = getNetworkInstance();
    const data = getNetworkData();
    const nodes = data.nodes || [];
    const edges = data.edges || [];
    const node = nodes.find((item) => item.id === nodeId);
    const focusRenderer = getFocusRenderer();

    if (!node || !network) return false;

    if (focusRenderer && network.body?.data?.nodes && network.body?.data?.edges) {
      focusRenderer(node, nodes, edges, network.body.data.nodes, network.body.data.edges);
    }

    try {
      network.selectNodes([nodeId]);
      network.focus(nodeId, {
        scale: 1.25,
        animation: { duration: 450, easingFunction: 'easeInOutQuad' },
      });
    } catch (_error) {
      return false;
    }

    return true;
  }

  function ensureBridgeReady() {
    const current = window.HYDRA_NETWORK_BRIDGE || {};
    if (current.focusNode === focusNode) return;

    window.HYDRA_NETWORK_BRIDGE = {
      fit: current.fit || (() => {}),
      stabilize: current.stabilize || (() => {}),
      reset: current.reset || (() => {}),
      filter: current.filter || (() => {}),
      focusNode,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureBridgeReady);
  } else {
    ensureBridgeReady();
  }

  const observer = new MutationObserver(() => ensureBridgeReady());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  let attempts = 0;
  const timer = window.setInterval(() => {
    ensureBridgeReady();
    attempts += 1;
    if (attempts > 80 || window.HYDRA_NETWORK_BRIDGE?.focusNode === focusNode) {
      window.clearInterval(timer);
    }
  }, 150);
})();
