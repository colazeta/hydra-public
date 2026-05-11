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

await page.waitForSelector('#process-canvas', { timeout: 10_000 });
await page.waitForSelector('#process-canvas-map', { timeout: 10_000 });
await page.waitForSelector('#canvas-focus-panel', { timeout: 10_000 });
await page.waitForSelector('#network', { timeout: 10_000 });
await page.waitForSelector('#network-graph', { timeout: 10_000 });
await page.waitForSelector('#network-detail-panel', { timeout: 10_000 });

const title = await page.locator('h1').first().innerText();
if (!title || title.length < 3) {
  throw new Error('Hero title did not render.');
}

const canvasNodeCount = await page.locator('#process-canvas-map .canvas-node').count();
if (canvasNodeCount < 1) {
  throw new Error('Process canvas did not render any public nodes.');
}

await page.locator('#process-canvas-map .canvas-node').first().click();
const focusText = await page.locator('#canvas-focus-panel').innerText();
if (!focusText || /Seleziona un elemento/i.test(focusText)) {
  throw new Error('Process canvas node click did not update the focus panel.');
}

const transformBeforeZoom = await page.locator('#process-canvas-map .canvas-transform').getAttribute('style');
await page.locator('#process-canvas-map [data-canvas-action="zoom-in"]').click();
await page.waitForTimeout(100);
const transformAfterZoom = await page.locator('#process-canvas-map .canvas-transform').getAttribute('style');
if (transformBeforeZoom === transformAfterZoom) {
  throw new Error('Process canvas zoom-in did not change transform style.');
}

await page.locator('#process-canvas-map [data-canvas-action="reset"]').click();
await page.waitForTimeout(100);
const transformAfterReset = await page.locator('#process-canvas-map .canvas-transform').getAttribute('style');
if (!/scale\(1\)/.test(transformAfterReset || '') || !/translate\(0px, 0px\)/.test(transformAfterReset || '')) {
  throw new Error(`Process canvas reset did not restore transform: ${transformAfterReset}`);
}

const themeLayerButton = page.locator('[data-canvas-layer="theme"]');
await themeLayerButton.click();
await page.waitForTimeout(150);
const themeLayerActive = await themeLayerButton.evaluate((node) => node.classList.contains('active'));
if (!themeLayerActive) {
  throw new Error('Process canvas theme layer did not become active.');
}

const themeLayerNonThemeNodes = await page.locator('#process-canvas-map .canvas-node:not(.canvas-theme)').count();
if (themeLayerNonThemeNodes > 0) {
  throw new Error(`Theme layer rendered non-theme nodes: ${themeLayerNonThemeNodes}`);
}

await page.locator('[data-canvas-layer="all"]').click();
await page.waitForTimeout(150);
await page.locator('#process-canvas-map [data-canvas-action="replay"]').click();
await page.waitForTimeout(1_100);
const replayActivated = await page.locator('#process-canvas-map .canvas-node.is-current').count();
if (replayActivated < 1) {
  throw new Error('Process canvas replay did not activate any event node.');
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

const personFilter = page.locator('#network .network-filters .filter-chip[data-filter="type:person"]');
if (await personFilter.count()) {
  await personFilter.click();
  await page.waitForTimeout(250);
  const personFilterActive = await personFilter.evaluate((node) => node.classList.contains('active'));
  if (!personFilterActive) {
    throw new Error('Person semantic filter did not become active.');
  }
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
