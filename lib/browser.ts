import "server-only";

import puppeteer, { type Browser, type Page } from "puppeteer";

const MAX_CONCURRENT_RENDERS = 2;
const CHROME_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
];

let browserPromise: Promise<Browser> | null = null;
let activeRenders = 0;
const renderQueue: Array<() => void> = [];

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: CHROME_ARGS,
  });

  browser.once("disconnected", () => {
    browserPromise = null;
  });

  return browser;
}

export async function getBrowser() {
  if (!browserPromise) {
    browserPromise = launchBrowser();
  }

  try {
    const browser = await browserPromise;

    if (!browser.connected) {
      browserPromise = null;
      return getBrowser();
    }

    return browser;
  } catch (error) {
    browserPromise = null;
    throw error;
  }
}

async function acquireRenderSlot() {
  if (activeRenders >= MAX_CONCURRENT_RENDERS) {
    await new Promise<void>((resolve) => renderQueue.push(resolve));
  }

  activeRenders += 1;
}

function releaseRenderSlot() {
  activeRenders -= 1;
  renderQueue.shift()?.();
}

export async function withBrowserPage<T>(run: (page: Page) => Promise<T>) {
  await acquireRenderSlot();
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    return await run(page);
  } finally {
    await page?.close().catch(() => undefined);
    releaseRenderSlot();
  }
}

type ScreenshotOptions = {
  url: string;
  selector: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
};

export function captureScreenshot({
  url,
  selector,
  width,
  height,
  deviceScaleFactor,
}: ScreenshotOptions) {
  return withBrowserPage(async (page) => {
    await page.setViewport({ width, height, deviceScaleFactor });
    const response = await page.goto(url, { waitUntil: "networkidle0" });

    if (!response?.ok()) {
      throw new Error(`Render page request failed with ${response?.status()}`);
    }

    const element = await page.waitForSelector(selector, { visible: true });

    if (!element) {
      throw new Error(`Capture target not found: ${selector}`);
    }

    await page.evaluate(() => document.fonts.ready);
    return element.screenshot({ type: "png" });
  });
}
