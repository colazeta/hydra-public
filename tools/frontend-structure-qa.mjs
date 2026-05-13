import fs from 'node:fs';

const required = ['index.html', 'app.js', 'styles.css', 'src/pages/HydraExplorerPrototype.tsx'];
let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING_REQUIRED_FILE ${file}`);
    failed = true;
  }
}

const appJs = fs.readFileSync('app.js', 'utf8');
if (/from\s+['\"]react['\"]/.test(appJs) || /createRoot\(/.test(appJs) || /\/src\//.test(appJs)) {
  console.error('STATIC_APP_COUPLED_TO_REACT');
  failed = true;
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
if (/src\/main\.tsx/.test(indexHtml) || /type=\"module\"\s+src=\"\/src\//.test(indexHtml)) {
  console.error('INDEX_POINTS_TO_REACT_ENTRY');
  failed = true;
}



const routesRaw = fs.readFileSync('config/routes.json', 'utf8');
let routesConfig;
try {
  routesConfig = JSON.parse(routesRaw);
} catch (_error) {
  console.error('INVALID_ROUTES_JSON config/routes.json');
  process.exit(1);
}

const expectedRoutes = [
  { name: 'static_dashboard', path: '/index.html', entry: 'index.html' },
  { name: 'prototype_stub', path: '/prototype/index.html', entry: 'prototype/index.html' },
];

if (!Array.isArray(routesConfig.routes)) {
  console.error('ROUTES_ARRAY_MISSING config/routes.json');
  failed = true;
} else {
  const normalized = routesConfig.routes.map((r) => ({ name: r?.name, path: r?.path, entry: r?.entry }));
  if (JSON.stringify(normalized) !== JSON.stringify(expectedRoutes)) {
    console.error('ROUTES_CONFIG_DRIFT');
    failed = true;
  }
}

if (!fs.existsSync('docs/architecture_decision_static_vs_prototype.md')) {
  console.error('MISSING_ADR_STATIC_VS_PROTOTYPE');
  failed = true;
}

if (failed) process.exit(1);
console.log('FRONTEND_STRUCTURE_QA_OK');
