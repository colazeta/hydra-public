(() => {
  function ensureToolbar() {
    const section = document.getElementById('network');
    const shell = section?.querySelector('.network-shell');
    if (!section || !shell || section.querySelector('.network-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'network-toolbar';
    toolbar.innerHTML = `
      <button id="network-expand-toggle" class="filter-chip" type="button">Espandi rete</button>
      <button id="network-center-view" class="filter-chip" type="button">Centra vista</button>
      <button id="network-collapse-focus" class="filter-chip" type="button">Reset pannello</button>
    `;

    shell.parentElement.insertBefore(toolbar, shell);

    document.getElementById('network-expand-toggle')?.addEventListener('click', toggleExpandedMode);
    document.getElementById('network-center-view')?.addEventListener('click', notifyNetworkResize);
    document.getElementById('network-collapse-focus')?.addEventListener('click', resetDetailPanel);
  }

  function toggleExpandedMode() {
    const expanded = document.body.classList.toggle('network-expanded');
    const button = document.getElementById('network-expand-toggle');
    if (button) button.textContent = expanded ? 'Riduci rete' : 'Espandi rete';
    window.setTimeout(notifyNetworkResize, 120);
  }

  function notifyNetworkResize() {
    window.dispatchEvent(new Event('resize'));
  }

  function resetDetailPanel() {
    const panel = document.getElementById('network-detail-panel');
    if (!panel) return;
    panel.innerHTML = `
      <p class="eyebrow">SELEZIONE</p>
      <h3>Seleziona un nodo o una relazione</h3>
      <p>Il dettaglio mostrerà tipologia, qualità del dato e note metodologiche.</p>
    `;
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
