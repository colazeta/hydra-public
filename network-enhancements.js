(() => {
  function getBridge() {
    return window.HYDRA_NETWORK_BRIDGE || null;
  }

  function ensureToolbar() {
    const section = document.getElementById('network');
    const shell = section?.querySelector('.network-shell');
    if (!section || !shell || section.querySelector('.network-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'network-toolbar';
    toolbar.innerHTML = `
      <button id="network-expand-toggle" class="filter-chip primary" type="button">Apri a schermo intero</button>
      <button id="network-center-view" class="filter-chip" type="button">Centra vista</button>
      <button id="network-stabilize-view" class="filter-chip" type="button">Ricalcola layout</button>
      <button id="network-collapse-focus" class="filter-chip" type="button">Reset focus</button>
      <span class="network-toolbar-hint">Clic su un nodo: isola il suo intorno documentale. Esc: chiudi fullscreen.</span>
    `;

    shell.parentElement.insertBefore(toolbar, shell);

    document.getElementById('network-expand-toggle')?.addEventListener('click', toggleExpandedMode);
    document.getElementById('network-center-view')?.addEventListener('click', () => getBridge()?.fit?.());
    document.getElementById('network-stabilize-view')?.addEventListener('click', () => getBridge()?.stabilize?.());
    document.getElementById('network-collapse-focus')?.addEventListener('click', () => getBridge()?.reset?.());
  }

  function toggleExpandedMode() {
    const expanded = document.body.classList.toggle('network-expanded');
    const button = document.getElementById('network-expand-toggle');
    if (button) button.textContent = expanded ? 'Chiudi schermo intero' : 'Apri a schermo intero';
    window.setTimeout(() => getBridge()?.fit?.(), 260);
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
