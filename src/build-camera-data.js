import puppeteer from "puppeteer";

import build from "./build";
import cameraLinks from "../build/camera-links";

const mapper = async (browser, camera, index, length) => {
  const page = await browser.newPage();
  const url = `${camera.href}/specifications`;

  console.log(`Fetching ${index + 1} of ${length}: ${url}`);
  await page.goto(url, { timeout: 10 * 60 * 1000, waitUntil: "load" });

  const data = await page.evaluate((body) => {
    const DATE_RE = /Announced\s+(.*?)(?:$|\s+•)/;
    const PRICE_RE = /([\$£€][\d,.]+)/;
    const WEIGHT_RE = /(.*?)\s*g/;
    const SENSOR_TYPE_RE = /(.*?)\s+\(/;
    const SENSOR_SIZE_RE = /\((.*?)\)/;
    const FOCAL_RE = /(\d+)(?:\s*–\s*(\d+))?/;

    const $$ = (el, s) => Array.from(el.querySelectorAll(s));
    const text = (el, s) => el.querySelector(s)?.innerText.trim();
    const head = (string, regex) => string?.match(regex)?.[1];
    const tail = (string, regex) => string?.match(regex)?.slice(1);
    const tr = (el, s) => $$(el, "tbody>tr").find((e) => text(e, "th") == s);
    const td = (el, name) => tr(el, name)?.querySelector("td")?.innerText;

    return {
      date: head(text(body, ".shortSpecs"), DATE_RE) || "?",
      msrp: head(td(body, "MSRP"), PRICE_RE) || "?",
      weight: head(td(body, "Weight (inc. batteries)"), WEIGHT_RE) || "?",
      type: td(body, "Body type") || "?",
      mount: td(body, "Lens mount") || "?",
      sensor: {
        type: head(td(body, "Sensor size"), SENSOR_TYPE_RE) || "?",
        size: head(td(body, "Sensor size"), SENSOR_SIZE_RE) || "?",
      },
      focal: tail(td(body, "Focal length (equiv.)"), FOCAL_RE) || "?",
    };
  }, await page.$("body"));

  await page.close();
  return { ...camera, ...data };
};

(async () => {
  let browser = await puppeteer.launch();
  let data = cameraLinks.flatMap((e) => e.cameras).reverse();
  await build(data, mapper.bind(null, browser), "build/camera-data.json");
  await browser.close();
})();
