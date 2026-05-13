import fs from 'node:fs';

const routePath = 'prototype/index.html';
if (!fs.existsSync(routePath)) {
  console.error('MISSING_PROTOTYPE_ROUTE_STUB');
  process.exit(1);
}

const html = fs.readFileSync(routePath, 'utf8');
if (!html.includes('Hydra Explorer Prototype')) {
  console.error('INVALID_PROTOTYPE_ROUTE_STUB_CONTENT');
  process.exit(1);
}

if (!html.includes('href="../index.html"')) {
  console.error('PROTOTYPE_ROUTE_MISSING_STATIC_BACKLINK');
  process.exit(1);
}

if (/src\/main\.tsx/.test(html) || /type="module"\s+src="\/src\//.test(html)) {
  console.error('PROTOTYPE_ROUTE_COUPLED_TO_REACT_ENTRY');
  process.exit(1);
}

console.log('PROTOTYPE_ROUTE_QA_OK');
