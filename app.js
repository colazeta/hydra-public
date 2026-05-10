async function loadJson(path, fallback = null) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function safeLoadJson(path, fallback) {
  try {
    return await loadJson(path, fallback);
  } catch (error) {
    console.warn(`[hydra] ${error.message}. Using fallback.`);
    return fallback;
  }
}

function slugifyStatus(text = "") {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function createBadge(text) {
  const statusClass = slugifyStatus(text);
  return `<span class="badge status-${statusClass}">${text}</span>`;
}

function formatDateLabel(rawDate) {
  if (!rawDate) return "Date unavailable";
  const parsed = new Date(`${rawDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC'
  }).format(parsed);
}

function metricCard(label, value, percent = 0) {
  return `
    <article class="metric-card">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
      <div class="metric-bar" style="--metric-width:${percent}%"></div>
    </article>`;
}

function computeStatusShare(collection, key = 'verification_status') {
  if (!collection.length) return 0;
  const verifiedCount = collection.filter(item => slugifyStatus(item[key]) === 'verified').length;
  return Math.round((verifiedCount / collection.length) * 100);
}

function renderMetrics(summary) {
  const container = document.getElementById('metrics-grid');
  container.innerHTML = [
    metricCard('Timeline events', summary.timelineCount, 100),
    metricCard('Issue streams', summary.issueCount, 100),
    metricCard('Hearings tracked', summary.hearingCount, 100),
    metricCard('Verified share', `${summary.verifiedShare}%`, summary.verifiedShare)
  ].join('');
}

function applyStatusFilter(filter = 'all') {
  const cards = document.querySelectorAll('.timeline-item, .card');
  cards.forEach(card => {
    const badge = card.querySelector('.badge');
    if (!badge) return;
    const matches = filter === 'all' || badge.classList.contains(`status-${filter}`);
    card.style.display = matches ? '' : 'none';
  });

  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function renderStatusFilters() {
  const panel = document.querySelector('.hero-panel');
  if (!panel) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'status-filters';
  wrapper.innerHTML = `
    <p class="panel-label">Filter by verification</p>
    <div class="filter-row">
      <button class="filter-chip active" data-filter="all">All</button>
      <button class="filter-chip" data-filter="verified">Verified</button>
      <button class="filter-chip" data-filter="pending-verification">Pending</button>
      <button class="filter-chip" data-filter="partially-verified">Partial</button>
      <button class="filter-chip" data-filter="disputed">Disputed</button>
      <button class="filter-chip" data-filter="unverified">Unverified</button>
    </div>`;
  panel.appendChild(wrapper);

  wrapper.querySelectorAll('.filter-chip').forEach(button => {
    button.addEventListener('click', () => applyStatusFilter(button.dataset.filter));
  });
}

async function renderTimeline(data) {
  const container = document.getElementById('timeline-list');
  container.innerHTML = data.items.map(item => `
    <article class="timeline-item">
      <p class="eyebrow">${formatDateLabel(item.date)}</p>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>`).join('');
}

async function renderHearings(data) {
  const container = document.getElementById('hearings-grid');
  container.innerHTML = data.hearings.map(item => `
    <article class="card">
      <p class="eyebrow">${formatDateLabel(item.date)}</p>
      <h3>${item.public_title}</h3>
      <p>${item.summary}</p>
      <p><strong>Issue clusters:</strong> ${item.issue_clusters.join(', ')}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>`).join('');
}

async function renderIssues(data) {
  const container = document.getElementById('issues-grid');
  container.innerHTML = data.issues.map(item => `
    <article class="card">
      <h3>${item.public_label}</h3>
      <p>${item.summary}</p>
      <p><strong>Status:</strong> ${item.current_status}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>`).join('');
}

async function renderSources(data) {
  const container = document.getElementById('sources-list');
  container.innerHTML = data.sources.map(item => `
    <article class="source-card">
      <h3>${item.outlet}</h3>
      <p><strong>${item.title}</strong></p>
      <p>${item.public_value}</p>
      <p><strong>Use limitation:</strong> ${item.use_limitations}</p>
      <p><a href="${item.url}" target="_blank" rel="noopener noreferrer">Open source</a></p>
    </article>`).join('');
}

async function init() {
  const [timeline, hearings, issues, sources] = await Promise.all([
    safeLoadJson('data/exports/public/public_timeline.json', { items: [] }),
    safeLoadJson('data/exports/public/public_hearings.json', { hearings: [] }),
    safeLoadJson('data/exports/public/public_issues.json', { issues: [] }),
    safeLoadJson('data/exports/public/public_sources.json', { sources: [] })
  ]);

  await renderTimeline(timeline);
  await renderHearings(hearings);
  await renderIssues(issues);
  await renderSources(sources);

  const missingDatasets = [];
  if (!hearings.hearings.length) missingDatasets.push('hearings');
  if (!issues.issues.length) missingDatasets.push('issues');
  if (!sources.sources.length) missingDatasets.push('sources');
  if (missingDatasets.length) {
    const caveat = document.querySelector('.caveat-box');
    if (caveat) {
      caveat.innerHTML += ` <em>Data not available in this public export: ${missingDatasets.join(', ')}.</em>`;
    }
  }

  const verifiedShare = computeStatusShare([
    ...timeline.items,
    ...hearings.hearings,
    ...issues.issues
  ]);

  renderMetrics({
    timelineCount: timeline.items.length,
    issueCount: issues.issues.length,
    hearingCount: hearings.hearings.length,
    verifiedShare
  });

  renderStatusFilters();
  applyStatusFilter('all');
}

init();
