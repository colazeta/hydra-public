(() => {
  const DEFAULT_PANEL = `
    <p class="eyebrow">SELEZIONE</p>
    <h3>Seleziona un nodo o una relazione</h3>
    <p>Il dettaglio mostrerà tipologia, qualità del dato e note metodologiche.</p>
  `;

  function getNetworkInstance() {
    try {
      if (typeof HYDRA_NETWORK_INSTANCE !== 'undefined' && HYDRA_NETWORK_INSTANCE) {
        return HYDRA_NETWORK_INSTANCE;
      }
    } catch {
      return null;
    }
    return null;
  }

  function ensureToolbar() {
    const section = document.getElementById('network');
    const shell = section?.querySelector('.network-shell');
    if (!section || !shell || section.querySelector('.network-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'network-toolbar';
    toolbar.innerHTML = `
      <button id="network-expand-toggle" class="filter-chip" type="button">Espandi rete</button>
      <button id="network-center-view" class="filter-chip" type="button">Centra vista</button>
      <button id="network-stabilize-view" class="filter-chip" type="button">Stabilizza</button>
      <button id="network-collapse-focus" class="filter-chip" type="button">Reset pannello</button>
    `;

    shell.parentElement.insertBefore(toolbar, shell);

    document.getElementById('network-expand-toggle')?.addEventListener('click', toggleExpandedMode);
    document.getElementById('network-center-view')?.addEventListener('click', fitNetwork);
    document.getElementById('network-stabilize-view')?.addEventListener('click', stabilizeNetwork);
    document.getElementById('network-collapse-focus')?.addEventListener('click', resetNetworkView);
  }

  function toggleExpandedMode() {
    const expanded = document.body.classList.toggle('network-expanded');
    const button = document.getElementById('network-expand-toggle');
    if (button) button.textContent = expanded ? 'Riduci rete' : 'Espandi rete';
    window.setTimeout(fitNetwork, 220);
  }

  function fitNetwork() {
    const network = getNetworkInstance();
    if (network?.fit) {
      network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
      return;
    }
    window.dispatchEvent(new Event('resize'));
  }

  function stabilizeNetwork() {
    const network = getNetworkInstance();
    if (!network) {
      window.dispatchEvent(new Event('resize'));
      return;
    }
    if (network.stabilize) network.stabilize(80);
    window.setTimeout(() => {
      if (network.setOptions) network.setOptions({ physics: false });
      fitNetwork();
    }, 700);
  }

  function resetDetailPanel() {
    const panel = document.getElementById('network-detail-panel');
    if (panel) panel.innerHTML = DEFAULT_PANEL;
  }

  function resetNetworkView() {
    resetDetailPanel();
    const network = getNetworkInstance();
    if (network?.unselectAll) network.unselectAll();
    fitNetwork();
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('network-expanded')) {
      toggleExpandedMode();
    }
  });

  const observer = new MutationObserver(() => ensureToolbar());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureToolbar);
  } else {
    ensureToolbar();
  }
})();
