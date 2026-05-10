import fs from 'node:fs';

const path = 'data/exports/public/public_network.json';
if (!fs.existsSync(path)) {
  console.error(`MISSING ${path}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const nodes = data.nodes || [];
const edges = data.edges || [];
let failed = false;

const ids = new Set();
for (const n of nodes) {
  if (!n.id || !n.type || !n.public_label) {
    console.error(`INVALID_NODE ${JSON.stringify(n)}`);
    failed = true;
  }
  if (ids.has(n.id)) {
    console.error(`DUPLICATE_NODE_ID ${n.id}`);
    failed = true;
  }
  ids.add(n.id);
}

for (const e of edges) {
  if (!e.id || !e.source || !e.target || !e.public_label) {
    console.error(`INVALID_EDGE ${JSON.stringify(e)}`);
    failed = true;
    continue;
  }
  if (!ids.has(e.source) || !ids.has(e.target)) {
    console.error(`BROKEN_EDGE_REF ${e.id} ${e.source}->${e.target}`);
    failed = true;
  }
}

if (typeof data.caveat !== 'string' || !data.caveat.trim()) {
  console.error('MISSING_CAVEAT_TEXT');
  failed = true;
}

if (failed) process.exit(1);
console.log(`NETWORK_QA_OK nodes=${nodes.length} edges=${edges.length}`);
