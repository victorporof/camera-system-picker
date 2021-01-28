import puppeteer from "puppeteer";

import build from "./build";
import lensLinks from "../build/lens-links";

const mapper = async (browser, lens, index, length) => {
  const page = await browser.newPage();
  const url = `${lens.href}/specifications`;

  console.log(`Fetching ${index + 1} of ${length}: ${url}`);
  await page.goto(url, { timeout: 10 * 60 * 1000, waitUntil: "load" });

  const data = await page.evaluate((body) => {
    const DATE_RE = /Announced\s+(.*?)(?:$|\s+•)/;
    const WEIGHT_RE = /(.*?)\s*g/;
    const FOCAL_RE = /(\d+)(?:\s*–\s*(\d+))?/;
    const FSTOP_RE = /([\d.,]+)(?:\s*–\s*([\d.,]+))?/;

    const $$ = (el, s) => Array.from(el.querySelectorAll(s));
    const text = (el, s) => el.querySelector(s)?.innerText.trim();
    const head = (string, regex) => string?.match(regex)?.[1];
    const tail = (string, regex) => string?.match(regex)?.slice(1);
    const tr = (el, s) => $$(el, "tbody>tr").find((e) => text(e, "th") == s);
    const td = (el, name) => tr(el, name)?.querySelector("td")?.innerText;

    return {
      date: head(text(body, ".shortSpecs"), DATE_RE) || "?",
      weight: head(td(body, "Weight"), WEIGHT_RE) || "?",
      mount: td(body, "Lens mount") || "?",
      focal: tail(td(body, "Focal length"), FOCAL_RE) || "?",
      fStop: tail(td(body, "Maximum aperture"), FSTOP_RE) || "?",
    };
  }, await page.$("body"));

  await page.close();
  return { ...lens, ...data };
};

(async () => {
  let browser = await puppeteer.launch();
  let data = lensLinks.flatMap((e) => e.lenses).reverse();
  await build(data, mapper.bind(null, browser), "build/lens-data.json");
  await browser.close();
})();
