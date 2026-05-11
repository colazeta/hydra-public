import { chromium } from '@playwright/test';

const url = process.env.HYDRA_PUBLIC_URL || 'http://127.0.0.1:4173/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const consoleMessages = [];
const pageErrors = [];

page.on('console', (message) => {
  if (['error'].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});

page.on('pageerror', (error) => {
  pageErrors.push(String(error));
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

await page.waitForSelector('#network', { timeout: 10_000 });
await page.waitForSelector('#network-graph', { timeout: 10_000 });
await page.waitForSelector('#network-detail-panel', { timeout: 10_000 });

const title = await page.locator('h1').first().innerText();
if (!title || title.length < 3) {
  throw new Error('Hero title did not render.');
}

const networkCanvasCount = await page.locator('#network-graph canvas').count();
if (networkCanvasCount < 1) {
  throw new Error('Network graph canvas was not rendered.');
}

if (networkCanvasCount > 1) {
  throw new Error(`Network graph rendered multiple canvases: ${networkCanvasCount}`);
}

const caveatText = await page.locator('#network-caveat').innerText();
if (!/responsabilità penali|responsibility/i.test(caveatText)) {
  throw new Error('Network caveat is missing or too weak.');
}

await page.waitForFunction(() => Boolean(window.HYDRA_NETWORK_BRIDGE), null, { timeout: 10_000 });

const bridgeApi = await page.evaluate(() => {
  const bridge = window.HYDRA_NETWORK_BRIDGE;
  return {
    hasFit: typeof bridge?.fit === 'function',
    hasStabilize: typeof bridge?.stabilize === 'function',
    hasReset: typeof bridge?.reset === 'function',
    hasFilter: typeof bridge?.filter === 'function',
  };
});

if (!bridgeApi.hasFit || !bridgeApi.hasStabilize || !bridgeApi.hasReset || !bridgeApi.hasFilter) {
  throw new Error(`Network bridge API incomplete: ${JSON.stringify(bridgeApi)}`);
}

const semanticFilterCount = await page.locator('#network .network-filters .filter-chip').count();
if (semanticFilterCount < 2) {
  throw new Error('Network semantic filters did not render.');
}

await page.locator('#network .network-filters .filter-chip[data-filter="type:person"]').click();
await page.waitForTimeout(250);

const personFilterActive = await page.locator('#network .network-filters .filter-chip[data-filter="type:person"]').evaluate((node) => node.classList.contains('active'));
if (!personFilterActive) {
  throw new Error('Person semantic filter did not become active.');
}

await page.evaluate(() => window.HYDRA_NETWORK_BRIDGE.filter('all'));
await page.waitForTimeout(150);
await page.evaluate(() => window.HYDRA_NETWORK_BRIDGE.reset());

const expandButton = page.locator('#network-expand-toggle');
await expandButton.waitFor({ timeout: 10_000 });
await expandButton.click();

const expanded = await page.evaluate(() => document.body.classList.contains('network-expanded'));
if (!expanded) {
  throw new Error('Network expanded mode did not activate.');
}

await page.keyboard.press('Escape');
const collapsed = await page.evaluate(() => !document.body.classList.contains('network-expanded'));
if (!collapsed) {
  throw new Error('Escape did not close network expanded mode.');
}

const nodesOrCards = await page.locator('.network-card').count();
if (nodesOrCards < 1) {
  throw new Error('Network fallback cards did not render.');
}

if (consoleMessages.length || pageErrors.length) {
  throw new Error([
    'Browser smoke test detected runtime errors:',
    ...consoleMessages,
    ...pageErrors,
  ].join('\n'));
}

await browser.close();
console.log('Hydra Public browser smoke test passed.');
