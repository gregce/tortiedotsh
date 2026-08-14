// Seeks the player to fixed times and screenshots each, to prove the
// composition frame tracks the seek position exactly.
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:4322";
const out = process.argv[3] ?? "docs/shots";
const chrome =
  "/Users/gdc/.cache/puppeteer/chrome/mac_arm-150.0.7871.24/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle0" });
await page.evaluate(() => document.getElementById("demo").scrollIntoView());
await page.waitForFunction(() => {
  const p = document.querySelector("hyperframes-player");
  return p && p.ready;
});
for (const t of [2.5, 6.5, 9.8, 12.5]) {
  const applied = await page.evaluate((time) => {
    const p = document.querySelector("hyperframes-player");
    p.seek(time);
    const tl = p.iframeElement.contentWindow.__timelines["durable-session"];
    return { reported: p.currentTime, timeline: tl.time() };
  }, t);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `${out}/seek-${t}.png` });
  console.log(t, JSON.stringify(applied));
}
await browser.close();
