(() => {
  const DEFAULT_PANEL = `
    <p class="eyebrow">SELEZIONE</p>
    <h3>Seleziona un nodo o una relazione</h3>
    <p>Il dettaglio mostrerà tipologia, qualità del dato e note metodologiche.</p>
  `;

  let localNetwork = null;
  let localNodes = null;
  let localEdges = null;
  let rawNetwork = { nodes: [], edges: [] };

  function getNetworkInstance() {
    try {
      if (localNetwork) return localNetwork;
      if (typeof HYDRA_NETWORK_INSTANCE !== 'undefined' && HYDRA_NETWORK_INSTANCE) return HYDRA_NETWORK_INSTANCE;
    } catch {
      return null;
    }
    return null;
  }

  function nodeColor(type) {
    if (type === 'person') return '#58beff';
    if (type === 'civil_party') return '#39d98a';
    if (type === 'legal_issue') return '#ffb454';
    return '#8672ff';
  }

  function badge(status = 'pending verification') {
    const slug = String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<span class="badge status-${slug}">${status}</span>`;
  }

  async function loadNetworkData() {
    const response = await fetch('data/exports/public/public_network.json');
    if (!response.ok) throw new Error('Unable to load public_network.json');
    rawNetwork = await response.json();
    rawNetwork.nodes = rawNetwork.nodes || [];
    rawNetwork.edges = rawNetwork.edges || [];
    return rawNetwork;
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
      <button id="network-collapse-focus" class="filter-chip" type="button">Reset focus</button>
    `;

    shell.parentElement.insertBefore(toolbar, shell);

    document.getElementById('network-expand-toggle')?.addEventListener('click', toggleExpandedMode);
    document.getElementById('network-center-view')?.addEventListener('click', fitNetwork);
    document.getElementById('network-stabilize-view')?.addEventListener('click', stabilizeNetwork);
    document.getElementById('network-collapse-focus')?.addEventListener('click', resetNetworkView);
  }

  function installSelfContainedNetwork() {
    const container = document.getElementById('network-graph');
    if (!container || !window.vis || localNetwork) return;

    loadNetworkData().then((data) => {
      const nodeIds = new Set(data.nodes.map((node) => node.id));
      const validEdges = data.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

      localNodes = new window.vis.DataSet(data.nodes.map((node) => ({
        id: node.id,
        label: node.public_label,
        shape: 'dot',
        size: 19,
        color: { background: nodeColor(node.type), border: '#eaf2ff' },
        font: { color: '#eaf2ff' },
        title: node.note || node.public_label,
      })));

      localEdges = new window.vis.DataSet(validEdges.map((edge) => ({
        id: edge.id,
        from: edge.source,
        to: edge.target,
        label: edge.public_label,
        arrows: 'to',
        color: { color: 'rgba(156,177,211,.7)' },
        font: { color: '#c4d4f1', size: 11, strokeWidth: 0 },
      })));

      localNetwork = new window.vis.Network(container, { nodes: localNodes, edges: localEdges }, {
        physics: { stabilization: true, barnesHut: { gravitationalConstant: -22000, springLength: 130, springConstant: 0.045 } },
        interaction: { hover: true, tooltipDelay: 120 },
        nodes: { borderWidth: 1 },
        edges: { smooth: { type: 'dynamic' } },
      });

      localNetwork.on('click', (params) => {
        if (params.nodes.length) {
          focusNode(params.nodes[0]);
          return;
        }
        if (params.edges.length) {
          focusEdge(params.edges[0]);
          return;
        }
        resetNetworkView();
      });
    }).catch((error) => {
      console.warn(error);
    });
  }

  function focusNode(nodeId) {
    const node = rawNetwork.nodes.find((item) => item.id === nodeId);
    if (!node || !localNodes || !localEdges) return;

    const relatedEdges = rawNetwork.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
    const relatedIds = new Set([nodeId, ...relatedEdges.flatMap((edge) => [edge.source, edge.target])]);

    localNodes.update(rawNetwork.nodes.map((item) => ({
      id: item.id,
      color: {
        background: nodeColor(item.type),
        border: relatedIds.has(item.id) ? '#ffffff' : 'rgba(156,177,211,.22)',
      },
      font: { color: relatedIds.has(item.id) ? '#eaf2ff' : 'rgba(156,177,211,.38)' },
    })));

    localEdges.update(rawNetwork.edges.map((edge) => ({
      id: edge.id,
      color: { color: relatedEdges.some((item) => item.id === edge.id) ? '#58beff' : 'rgba(156,177,211,.14)' },
      width: relatedEdges.some((item) => item.id === edge.id) ? 2 : 1,
    })));

    showPanel(`
      <p class="eyebrow">${node.type}</p>
      <h3>${node.public_label}</h3>
      <p>${node.note || ''}</p>
      ${badge(node.quality_status)}
      <p class="network-guard"><strong>Caveat.</strong> Questa rete mostra relazioni processuali e documentali, non responsabilità penali.</p>
      ${relatedEdges.length ? `<p><strong>Relazioni collegate</strong></p><ul>${relatedEdges.map((edge) => `<li>${edge.public_label}</li>`).join('')}</ul>` : ''}
    `);
  }

  function focusEdge(edgeId) {
    const edge = rawNetwork.edges.find((item) => item.id === edgeId);
    if (!edge || !localEdges || !localNodes) return;
    const source = rawNetwork.nodes.find((node) => node.id === edge.source);
    const target = rawNetwork.nodes.find((node) => node.id === edge.target);

    localEdges.update(rawNetwork.edges.map((item) => ({
      id: item.id,
      color: { color: item.id === edgeId ? '#58beff' : 'rgba(156,177,211,.16)' },
      width: item.id === edgeId ? 2 : 1,
    })));

    showPanel(`
      <p class="eyebrow">Relazione</p>
      <h3>${source?.public_label || edge.source} → ${target?.public_label || edge.target}</h3>
      <p>${edge.public_label}</p>
      ${badge(edge.quality_status)}
      <p class="network-guard"><strong>Caveat.</strong> Una relazione nel grafo indica un collegamento processuale o documentale, non una conclusione giudiziaria.</p>
    `);
  }

  function showPanel(html) {
    const panel = document.getElementById('network-detail-panel');
    if (panel) panel.innerHTML = html;
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
    if (localNodes && rawNetwork.nodes.length) {
      localNodes.update(rawNetwork.nodes.map((node) => ({
        id: node.id,
        color: { background: nodeColor(node.type), border: '#eaf2ff' },
        font: { color: '#eaf2ff' },
      })));
    }
    if (localEdges && rawNetwork.edges.length) {
      localEdges.update(rawNetwork.edges.map((edge) => ({
        id: edge.id,
        color: { color: 'rgba(156,177,211,.7)' },
        width: 1,
      })));
    }
    fitNetwork();
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('network-expanded')) {
      toggleExpandedMode();
    }
  });

  const observer = new MutationObserver(() => {
    ensureToolbar();
    installSelfContainedNetwork();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureToolbar();
      installSelfContainedNetwork();
    });
  } else {
    ensureToolbar();
    installSelfContainedNetwork();
  }
})();
