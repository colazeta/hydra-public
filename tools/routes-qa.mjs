import fs from 'node:fs';

const cfgPath = 'config/routes.json';
if (!fs.existsSync(cfgPath)) {
  console.error('MISSING_ROUTES_CONFIG');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
if (!Array.isArray(cfg.routes) || cfg.routes.length < 2) {
  console.error('INVALID_ROUTES_CONFIG');
  process.exit(1);
}

let failed = false;
for (const route of cfg.routes) {
  if (!route.name || !route.path || !route.entry) {
    console.error(`INVALID_ROUTE_ENTRY ${JSON.stringify(route)}`);
    failed = true;
    continue;
  }
  if (!fs.existsSync(route.entry)) {
    console.error(`MISSING_ROUTE_ENTRY_FILE ${route.entry}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`ROUTES_QA_OK count=${cfg.routes.length}`);
