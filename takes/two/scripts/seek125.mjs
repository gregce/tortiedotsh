// Scroll take two's scrub section until the timeline reads about 12.5s,
// then screenshot the stage.
import puppeteer from "puppeteer-core";

const chrome =
  "/Users/gdc/.cache/puppeteer/chrome/mac_arm-150.0.7871.24/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = process.argv[2];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const p = await browser.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto("http://localhost:4322/", { waitUntil: "networkidle0" });
await p.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
await p.evaluate(() => document.getElementById("demo").scrollIntoView());
await p.waitForFunction(
  () => {
    const pl = document.querySelector("hyperframes-player");
    return pl && pl.ready;
  },
  { timeout: 15000 },
);

const goto = async (f) => {
  await p.evaluate((fr) => {
    const s = document.getElementById("demo");
    const range = s.offsetHeight - window.innerHeight;
    window.scrollTo(0, s.offsetTop + range * fr);
  }, f);
  await new Promise((r) => setTimeout(r, 400));
  return p.evaluate(() => document.querySelector("hyperframes-player").currentTime);
};

// Walk fractions until currentTime is close to 12.5.
let best = null;
for (let f = 0.8; f <= 1.001; f += 0.02) {
  const t = await goto(f);
  if (best === null || Math.abs(t - 12.5) < Math.abs(best.t - 12.5)) best = { f, t };
}
const t = await goto(best.f);
const stage = await p.$("#demo-stage");
await stage.screenshot({ path: `${OUT}/fix-two-live-12.5s.png` });
console.log(JSON.stringify({ fraction: best.f, currentTime: t }));
await browser.close();
