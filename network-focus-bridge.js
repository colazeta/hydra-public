(() => {
  let rawNetwork = { nodes: [], edges: [] };
  let installedOn = null;

  function badge(status = 'pending verification') {
    const slug = String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<span class="badge status-${slug}">${status}</span>`;
  }

  function nodeColor(type) {
    if (type === 'person') return '#58beff';
    if (type === 'civil_party') return '#39d98a';
    if (type === 'legal_issue') return '#ffb454';
    return '#8672ff';
  }

  function getNetwork() {
    try {
      if (typeof HYDRA_NETWORK_INSTANCE !== 'undefined' && HYDRA_NETWORK_INSTANCE) return HYDRA_NETWORK_INSTANCE;
    } catch {
      return null;
    }
    return null;
  }

  async function loadRawNetwork() {
    if (rawNetwork.nodes.length) return rawNetwork;
    const response = await fetch('data/exports/public/public_network.json');
    if (!response.ok) throw new Error('Unable to load public_network.json');
    rawNetwork = await response.json();
    rawNetwork.nodes = rawNetwork.nodes || [];
    rawNetwork.edges = rawNetwork.edges || [];
    return rawNetwork;
  }

  function showPanel(html) {
    const panel = document.getElementById('network-detail-panel');
    if (panel) panel.innerHTML = html;
  }

  function resetPanel() {
    showPanel(`
      <p class="eyebrow">SELEZIONE</p>
      <h3>Seleziona un nodo o una relazione</h3>
      <p>Il dettaglio mostrerà tipologia, qualità del dato e note metodologiche.</p>
    `);
  }

  function resetStyles(network) {
    const nodeData = network?.body?.data?.nodes;
    const edgeData = network?.body?.data?.edges;
    if (!nodeData || !edgeData) return;

    nodeData.update(rawNetwork.nodes.map((node) => ({
      id: node.id,
      color: { background: nodeColor(node.type), border: '#eaf2ff' },
      font: { color: '#eaf2ff' },
    })));

    edgeData.update(rawNetwork.edges.map((edge) => ({
      id: edge.id,
      color: { color: 'rgba(156,177,211,.7)' },
      width: 1,
    })));
  }

  function focusNode(network, nodeId) {
    const nodeData = network?.body?.data?.nodes;
    const edgeData = network?.body?.data?.edges;
    if (!nodeData || !edgeData) return;

    const node = rawNetwork.nodes.find((item) => item.id === nodeId);
    if (!node) return;

    const relatedEdges = rawNetwork.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
    const relatedIds = new Set([nodeId, ...relatedEdges.flatMap((edge) => [edge.source, edge.target])]);
    const relatedEdgeIds = new Set(relatedEdges.map((edge) => edge.id));

    nodeData.update(rawNetwork.nodes.map((item) => ({
      id: item.id,
      color: {
        background: nodeColor(item.type),
        border: relatedIds.has(item.id) ? '#ffffff' : 'rgba(156,177,211,.20)',
      },
      font: { color: relatedIds.has(item.id) ? '#eaf2ff' : 'rgba(156,177,211,.35)' },
    })));

    edgeData.update(rawNetwork.edges.map((edge) => ({
      id: edge.id,
      color: { color: relatedEdgeIds.has(edge.id) ? '#58beff' : 'rgba(156,177,211,.14)' },
      width: relatedEdgeIds.has(edge.id) ? 2 : 1,
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

  function focusEdge(network, edgeId) {
    const edgeData = network?.body?.data?.edges;
    if (!edgeData) return;

    const edge = rawNetwork.edges.find((item) => item.id === edgeId);
    if (!edge) return;

    const source = rawNetwork.nodes.find((node) => node.id === edge.source);
    const target = rawNetwork.nodes.find((node) => node.id === edge.target);

    edgeData.update(rawNetwork.edges.map((item) => ({
      id: item.id,
      color: { color: item.id === edgeId ? '#58beff' : 'rgba(156,177,211,.16)' },
      width: item.id === edgeId ? 2 : 1,
    })));

    showPanel(`
      <p class="eyebrow">Relazione</p>
      <h3>${source?.public_label || edge.source} → ${target?.public_label || edge.target}</h3>
      <p>${edge.public_label}</p>
      ${badge(edge.quality_status)}
      <p class="network-guard"><strong>Caveat.</strong> Una relazione indica un collegamento processuale o documentale, non una conclusione giudiziaria.</p>
    `);
  }

  async function installBridge() {
    const network = getNetwork();
    if (!network || installedOn === network) return;

    await loadRawNetwork();
    installedOn = network;

    network.on('click', (params) => {
      if (params.nodes?.length) {
        focusNode(network, params.nodes[0]);
        return;
      }
      if (params.edges?.length) {
        focusEdge(network, params.edges[0]);
        return;
      }
      resetStyles(network);
      resetPanel();
    });

    window.HYDRA_NETWORK_BRIDGE = {
      fit: () => network.fit?.({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } }),
      stabilize: () => {
        network.stabilize?.(80);
        window.setTimeout(() => network.setOptions?.({ physics: false }), 700);
      },
      reset: () => {
        resetStyles(network);
        resetPanel();
        network.unselectAll?.();
        network.fit?.({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
      },
    };
  }

  const observer = new MutationObserver(() => {
    installBridge().catch((error) => console.warn(error));
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => installBridge().catch((error) => console.warn(error)));
  } else {
    installBridge().catch((error) => console.warn(error));
  }
})();
