(() => {
  let canvasData = { themes: [], events: [], documents: [], actors: [] };
  let activeLayer = 'all';
  let scale = 1;
  let offset = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let replayTimer = null;

  const tone = ['red','violet','blue','green','orange'];
  const safe = (value = '') => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  async function loadJson(path, fallback) {
    try { const response = await fetch(path); if (!response.ok) return fallback; return await response.json(); } catch { return fallback; }
  }

  function dateLabel(rawDate) {
    if (!rawDate) return 'data non disponibile';
    const d = new Date(`${rawDate}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return rawDate;
    return new Intl.DateTimeFormat('it', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
  }

  function buildData(timeline, issues, evidence, network) {
    const themes = (issues.issues || []).slice(0, 6).map((item, index) => ({ id: `theme-${index}`, type: 'theme', label: item.public_label, summary: item.summary || item.current_status || '', status: item.verification_status || 'pending verification', tone: tone[index % tone.length], x: 9 + (index % 2) * 18, y: 16 + Math.floor(index / 2) * 24 }));
    const events = (timeline.items || []).slice(0, 8).map((item, index) => ({ id: `event-${index}`, type: 'event', label: item.title || 'Evento', summary: item.summary || '', status: item.verification_status || 'pending verification', date: item.date, x: 39 + (index % 4) * 13, y: 15 + Math.floor(index / 4) * 32 }));
    const documents = (evidence.items || []).slice(0, 5).map((item, index) => ({ id: `document-${index}`, type: 'document', label: item.title || 'Documento', summary: item.summary || 'Fonte/documento da leggere con caveat.', status: item.verification_status || 'pending verification', x: 52 + (index % 3) * 13, y: 63 + Math.floor(index / 3) * 18 }));
    const actors = (network.nodes || []).slice(0, 6).map((item, index) => ({ id: `actor-${index}`, type: 'actor', label: item.public_label || item.id, summary: item.note || 'Nodo del network processuale/documentale.', status: item.quality_status || 'pending verification', x: 78 + (index % 2) * 10, y: 16 + Math.floor(index / 2) * 24 }));
    canvasData = { themes, events, documents, actors };
  }

  function allItems() { return [...canvasData.themes, ...canvasData.events, ...canvasData.documents, ...canvasData.actors]; }
  function visibleItems() { return allItems().filter((item) => activeLayer === 'all' || item.type === activeLayer); }
  function itemClass(item) { return `canvas-node canvas-${item.type} ${item.tone ? `theme-${item.tone}` : ''}`; }

  function lineFor(item, idx) {
    const target = canvasData.events[idx % Math.max(canvasData.events.length, 1)] || canvasData.documents[0] || canvasData.actors[0];
    if (!target || item.id === target.id) return '';
    return `<line class="canvas-line line-${item.type}" x1="${item.x + 5}%" y1="${item.y + 4}%" x2="${target.x + 5}%" y2="${target.y + 4}%" />`;
  }

  function transformStyle() { return `transform: translate(${offset.x}px, ${offset.y}px) scale(${scale});`; }

  function renderCanvas(layer = activeLayer) {
    activeLayer = layer;
    const root = document.getElementById('process-canvas-map');
    if (!root) return;
    const visible = visibleItems();
    const lines = visible.map(lineFor).join('');
    const nodes = visible.map((item) => `
      <button class="${itemClass(item)}" type="button" data-canvas-id="${item.id}" style="--cx:${item.x}%;--cy:${item.y}%">
        <span>${item.type}</span><strong>${safe(item.label)}</strong>${item.date ? `<small>${dateLabel(item.date)}</small>` : ''}
      </button>`).join('');
    root.innerHTML = `<div class="canvas-transform" style="${transformStyle()}"><svg class="canvas-lines" aria-hidden="true">${lines}</svg><div class="canvas-stage">${nodes}</div></div><div class="canvas-mini-map"><span></span><span></span><span></span></div><div class="canvas-controls"><button type="button" data-canvas-action="zoom-in">+</button><button type="button" data-canvas-action="zoom-out">−</button><button type="button" data-canvas-action="reset">Reset</button><button type="button" data-canvas-action="replay">Replay</button></div>`;
    root.querySelectorAll('.canvas-node').forEach((node) => node.addEventListener('click', () => focusItem(node.dataset.canvasId)));
    bindCanvasGestures(root);
    bindControls(root);
  }

  function applyTransform() {
    const transform = document.querySelector('#process-canvas-map .canvas-transform');
    if (transform) transform.setAttribute('style', transformStyle());
  }

  function focusItem(id) {
    const item = allItems().find((entry) => entry.id === id);
    const panel = document.getElementById('canvas-focus-panel');
    if (!item || !panel) return;
    document.querySelectorAll('.canvas-node').forEach((node) => node.classList.toggle('is-current', node.dataset.canvasId === id));
    panel.innerHTML = `<p class="eyebrow">${safe(item.type)}</p><h3>${safe(item.label)}</h3><p>${safe(item.summary)}</p><div class="continuity-mini"><article><strong>Cosa introduce</strong><span>${item.type === 'theme' ? 'Una traiettoria tematica da seguire nel tempo.' : 'Un punto osservabile nella ricostruzione pubblica.'}</span></article><article><strong>Cosa richiama</strong><span>Fonti, eventi o relazioni collegate da verificare nel dettaglio.</span></article><article><strong>Caveat</strong><span>La connessione è documentale/processuale, non una conclusione di responsabilità.</span></article></div><span class="badge status-${safe(item.status).toLowerCase().replace(/[^a-z0-9]+/g,'-')}">${safe(item.status)}</span>`;
  }

  function bindCanvasGestures(root) {
    root.onpointerdown = (event) => {
      if (event.target.closest('.canvas-node') || event.target.closest('.canvas-controls')) return;
      isDragging = true;
      dragStart = { x: event.clientX - offset.x, y: event.clientY - offset.y };
      root.setPointerCapture?.(event.pointerId);
      root.classList.add('is-panning');
    };
    root.onpointermove = (event) => {
      if (!isDragging) return;
      offset = { x: event.clientX - dragStart.x, y: event.clientY - dragStart.y };
      applyTransform();
    };
    root.onpointerup = () => { isDragging = false; root.classList.remove('is-panning'); };
    root.onwheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.08 : 0.08;
      scale = Math.min(1.8, Math.max(0.72, scale + delta));
      applyTransform();
    };
  }

  function bindControls(root) {
    root.querySelectorAll('[data-canvas-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.canvasAction;
        if (action === 'zoom-in') scale = Math.min(1.8, scale + 0.14);
        if (action === 'zoom-out') scale = Math.max(0.72, scale - 0.14);
        if (action === 'reset') { scale = 1; offset = { x: 0, y: 0 }; }
        if (action === 'replay') { startCanvasReplay(); return; }
        applyTransform();
      });
    });
  }

  function startCanvasReplay() {
    clearInterval(replayTimer);
    const items = visibleItems().filter((item) => item.type === 'event');
    if (!items.length) return;
    let index = 0;
    replayTimer = setInterval(() => {
      if (index >= items.length) { clearInterval(replayTimer); return; }
      focusItem(items[index].id);
      index += 1;
    }, 950);
  }

  function bindLayerButtons() {
    document.querySelectorAll('[data-canvas-layer]').forEach((button) => {
      if (button.dataset.canvasBound === 'true') return;
      button.dataset.canvasBound = 'true';
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-canvas-layer]').forEach((btn) => btn.classList.toggle('active', btn === button));
        renderCanvas(button.dataset.canvasLayer || 'all');
      });
    });
  }

  async function initCanvas() {
    const [timeline, issues, evidence, network] = await Promise.all([
      loadJson('data/exports/public/public_timeline.json', { items: [] }),
      loadJson('data/exports/public/public_issues.json', { issues: [] }),
      loadJson('data/exports/public/public_evidence.json', { items: [] }),
      loadJson('data/exports/public/public_network.json', { nodes: [], edges: [] }),
    ]);
    buildData(timeline, issues, evidence, network);
    renderCanvas(activeLayer);
    bindLayerButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCanvas); else initCanvas();
})();
