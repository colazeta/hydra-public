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


if (!fs.existsSync('docs/architecture_decision_static_vs_prototype.md')) {
  console.error('MISSING_ADR_STATIC_VS_PROTOTYPE');
  failed = true;
}

if (failed) process.exit(1);
console.log('FRONTEND_STRUCTURE_QA_OK');
