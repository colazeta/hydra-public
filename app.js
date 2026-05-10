async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function createBadge(text) {
  return `<span class="badge">${text}</span>`;
}

async function renderTimeline() {
  const data = await loadJson('data/exports/public/public_timeline.json');
  const container = document.getElementById('timeline-list');

  container.innerHTML = data.items.map(item => `
    <article class="timeline-item">
      <p class="eyebrow">${item.date}</p>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>
  `).join('');
}

async function renderHearings() {
  const data = await loadJson('data/exports/public/public_hearings.json');
  const container = document.getElementById('hearings-grid');

  container.innerHTML = data.hearings.map(item => `
    <article class="card">
      <p class="eyebrow">${item.date}</p>
      <h3>${item.public_title}</h3>
      <p>${item.summary}</p>
      <p><strong>Issue clusters:</strong> ${item.issue_clusters.join(', ')}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>
  `).join('');
}

async function renderIssues() {
  const data = await loadJson('data/exports/public/public_issues.json');
  const container = document.getElementById('issues-grid');

  container.innerHTML = data.issues.map(item => `
    <article class="card">
      <h3>${item.public_label}</h3>
      <p>${item.summary}</p>
      <p><strong>Status:</strong> ${item.current_status}</p>
      ${createBadge(item.verification_status)}
      <p><strong>Caveat.</strong> ${item.public_caveat}</p>
    </article>
  `).join('');
}

async function renderSources() {
  const data = await loadJson('data/exports/public/public_sources.json');
  const container = document.getElementById('sources-list');

  container.innerHTML = data.sources.map(item => `
    <article class="source-card">
      <h3>${item.outlet}</h3>
      <p><strong>${item.title}</strong></p>
      <p>${item.public_value}</p>
      <p><strong>Use limitation:</strong> ${item.use_limitations}</p>
      <p><a href="${item.url}" target="_blank">Open source</a></p>
    </article>
  `).join('');
}

async function init() {
  await renderTimeline();
  await renderHearings();
  await renderIssues();
  await renderSources();
}

init();
