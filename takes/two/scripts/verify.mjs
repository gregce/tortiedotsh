// Drives the built site in an isolated headless Chrome. Verifies:
// - the player mounts, resolves the 13.0s timeline, and scroll scrubs it
// - no request leaves localhost
// - screenshots at 1440 and 390 wide
// Usage: node scripts/verify.mjs <baseUrl> <outDir>
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:4322";
const out = process.argv[3] ?? "docs/shots";
const chrome =
  "/Users/gdc/.cache/puppeteer/chrome/mac_arm-150.0.7871.24/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();

const offOrigin = [];
page.on("request", (r) => {
  const u = new URL(r.url());
  if (u.hostname !== "localhost" && u.protocol !== "data:") offOrigin.push(r.url());
});

// ── 1440 wide ──────────────────────────────────────────────────────
await page.setViewport({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle0" });
await page.screenshot({ path: `${out}/take2-1440-hero.png` });

// Instant scrolling: headless frames and smooth scroll do not mix.
await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));

// Scroll to the demo, wait for the player.
await page.evaluate(() => document.getElementById("demo").scrollIntoView());
await page.waitForFunction(
  () => {
    const p = document.querySelector("hyperframes-player");
    return p && p.ready;
  },
  { timeout: 15000 },
);
const state1 = await page.evaluate(() => {
  const p = document.querySelector("hyperframes-player");
  const s = document.getElementById("demo");
  return {
    duration: p.duration,
    enhanced: s.classList.contains("enhanced"),
    sectionHeight: Math.round(s.getBoundingClientRect().height),
  };
});

// Scrub by scrolling: middle of the section, then near the end.
const probe = async (fraction) => {
  await page.evaluate((f) => {
    const s = document.getElementById("demo");
    const top = s.offsetTop;
    const range = s.offsetHeight - window.innerHeight;
    window.scrollTo(0, top + range * f);
  }, fraction);
  await new Promise((r) => setTimeout(r, 400));
  return page.evaluate(() => {
    const p = document.querySelector("hyperframes-player");
    return Math.round(p.currentTime * 100) / 100;
  });
};
const tAt25 = await probe(0.25);
const tAt50 = await probe(0.5);
await page.screenshot({ path: `${out}/take2-1440-demo-mid.png` });
const tAt95 = await probe(0.95);
await page.screenshot({ path: `${out}/take2-1440-demo-end.png` });

// Full page shot for the record.
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 300));

// ── 390 wide ───────────────────────────────────────────────────────
const page2 = await browser.newPage();
page2.on("request", (r) => {
  const u = new URL(r.url());
  if (u.hostname !== "localhost" && u.protocol !== "data:") offOrigin.push(r.url());
});
await page2.setViewport({ width: 390, height: 844 });
await page2.goto(base + "/", { waitUntil: "networkidle0" });
await page2.screenshot({ path: `${out}/take2-390-hero.png` });
const hscroll = await page2.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
);
await page2.evaluate(() => document.getElementById("demo").scrollIntoView());
await new Promise((r) => setTimeout(r, 2000));
await page2.screenshot({ path: `${out}/take2-390-demo.png` });
await page2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 400));
await page2.screenshot({ path: `${out}/take2-390-bottom.png` });

// ── Reduced motion ─────────────────────────────────────────────────
const page3 = await browser.newPage();
await page3.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page3.setViewport({ width: 1440, height: 900 });
await page3.goto(base + "/", { waitUntil: "networkidle0" });
await page3.evaluate(() => document.getElementById("demo").scrollIntoView());
await new Promise((r) => setTimeout(r, 800));
const reducedTag = await page3.evaluate(() => {
  const v = document.querySelector("#demo-stage video");
  return v ? { tag: "video", controls: v.controls, autoplay: v.autoplay, preload: v.preload } : null;
});
await page3.screenshot({ path: `${out}/take2-1440-reduced.png` });

// ── JS disabled ────────────────────────────────────────────────────
const page4 = await browser.newPage();
await page4.setJavaScriptEnabled(false);
await page4.setViewport({ width: 1440, height: 900 });
await page4.goto(base + "/", { waitUntil: "networkidle0" });
const nojs = await page4.evaluate(() => {
  const img = document.querySelector("#demo-stage img");
  const ctas = [...document.querySelectorAll('a.btn')].length;
  return { posterImg: !!img, ctaCount: ctas };
});
await page4.evaluate(() => document.getElementById("demo").scrollIntoView());
await page4.screenshot({ path: `${out}/take2-1440-nojs-demo.png` });

console.log(
  JSON.stringify(
    { state1, tAt25, tAt50, tAt95, hscroll390: hscroll, reducedTag, nojs, offOrigin },
    null,
    2,
  ),
);
await browser.close();
