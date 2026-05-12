(() => {
  const esc = (value = '') => String(value ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  }

  function nodeLabel(nodesById, id) {
    return nodesById.get(id)?.public_label || id;
  }

  function nodeType(nodesById, id) {
    return nodesById.get(id)?.type || 'unknown';
  }

  function qualityLabel(value = '') {
    return String(value || 'non indicato').replace(/_/g, ' ');
  }

  function buildNetworkRadar(network) {
    const nodes = (network.nodes || []).filter((node) => node?.id);
    const edges = (network.edges || []).filter((edge) => edge?.source && edge?.target);
    const nodesById = new Map(nodes.map((node) => [node.id, node]));
    const degree = new Map(nodes.map((node) => [node.id, 0]));
    const edgeQuality = new Map();
    const typeCounts = new Map();

    nodes.forEach((node) => typeCounts.set(node.type || 'unknown', (typeCounts.get(node.type || 'unknown') || 0) + 1));
    edges.forEach((edge) => {
      degree.set(edge.source, (degree.get(edge.source) || 0) + 1);
      degree.set(edge.target, (degree.get(edge.target) || 0) + 1);
      const quality = edge.quality_status || 'non indicato';
      edgeQuality.set(quality, (edgeQuality.get(quality) || 0) + 1);
    });

    const centralNodes = [...degree.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ id, count, label: nodeLabel(nodesById, id), type: nodeType(nodesById, id) }));

    const relationshipRows = edges.slice(0, 6).map((edge) => ({
      source: nodeLabel(nodesById, edge.source),
      target: nodeLabel(nodesById, edge.target),
      label: edge.public_label || 'Relazione documentale',
      quality: edge.quality_status || 'non indicato',
    }));

    return { nodes, edges, centralNodes, relationshipRows, typeCounts, edgeQuality };
  }

  function renderRadar(network) {
    const section = document.getElementById('network');
    const shell = section?.querySelector('.network-shell');
    if (!section || !shell || section.querySelector('.network-radar')) return;

    const radar = buildNetworkRadar(network);
    const maxDegree = Math.max(...radar.centralNodes.map((node) => node.count), 1);
    const typeSummary = [...radar.typeCounts.entries()].map(([type, count]) => `<span>${esc(type)} <strong>${count}</strong></span>`).join('');
    const qualitySummary = [...radar.edgeQuality.entries()].map(([quality, count]) => `<span>${esc(qualityLabel(quality))} <strong>${count}</strong></span>`).join('');

    const panel = document.createElement('div');
    panel.className = 'network-radar';
    panel.innerHTML = `
      <article class="radar-card radar-card-main">
        <p class="eyebrow">Radar rete</p>
        <h3>Centralità e qualità del dato</h3>
        <p>Questa sintesi aiuta a capire quali nodi concentrano più connessioni nell’export pubblico e quale tipo di evidenza sostiene le relazioni.</p>
        <div class="radar-pills">${typeSummary || '<span>Nessun tipo nodo disponibile</span>'}</div>
        <div class="radar-pills quality">${qualitySummary || '<span>Qualità relazioni non indicata</span>'}</div>
      </article>
      <article class="radar-card">
        <p class="eyebrow">Nodi più connessi</p>
        <div class="centrality-list">
          ${radar.centralNodes.map((node) => `
            <button class="centrality-row" data-radar-node="${esc(node.id)}" type="button">
              <span><strong>${esc(node.label)}</strong><small>${esc(node.type)}</small></span>
              <i style="--w:${Math.max(12, Math.round((node.count / maxDegree) * 100))}%"></i>
              <b>${node.count}</b>
            </button>
          `).join('') || '<p>Nessun nodo disponibile.</p>'}
        </div>
      </article>
      <article class="radar-card">
        <p class="eyebrow">Relazioni da leggere</p>
        <div class="relationship-list">
          ${radar.relationshipRows.map((row) => `
            <div class="relationship-row">
              <strong>${esc(row.source)} → ${esc(row.target)}</strong>
              <p>${esc(row.label)}</p>
              <small>${esc(qualityLabel(row.quality))}</small>
            </div>
          `).join('') || '<p>Nessuna relazione disponibile.</p>'}
        </div>
      </article>
    `;

    shell.parentElement.insertBefore(panel, shell);
  }

  function installPublicSearch() {
    const input = document.querySelector('.search-box input');
    if (!input || input.dataset.hydraSearchReady) return;
    input.dataset.hydraSearchReady = 'true';

    const result = document.createElement('div');
    result.className = 'search-result-count';
    input.closest('.search-box')?.insertAdjacentElement('afterend', result);

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const cards = [...document.querySelectorAll('.timeline-item, .card, .source-card, .network-card, .evidence-card, .theme-card')];
      let matches = 0;

      cards.forEach((card) => {
        const text = (card.dataset.search || card.textContent || '').toLowerCase();
        const matched = !query || text.includes(query);
        card.classList.toggle('search-hidden', !matched);
        card.classList.toggle('search-match', Boolean(query && matched));
        if (query && matched) matches += 1;
      });

      result.textContent = query ? `${matches} elementi compatibili con “${input.value.trim()}”` : '';
    });
  }

  async function init() {
    installPublicSearch();
    try {
      const network = await loadJson('data/exports/public/public_network.json');
      renderRadar(network);
    } catch (error) {
      // The main app already handles public-data loading errors. This layer remains non-blocking.
      console.warn('[Hydra investigative layer]', error);
    }
  }

  const observer = new MutationObserver(() => {
    installPublicSearch();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
