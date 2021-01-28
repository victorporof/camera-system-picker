import puppeteer from "puppeteer";
import range from "lodash/range";

import build from "./build";

const YEARS = range(2010, 2022);

const URL = (year) =>
  `https://www.dpreview.com/products/timeline?year=${year}&category=cameras`;

const mapper = async (browser, year, _index, _length) => {
  const page = await browser.newPage();
  const url = URL(year);

  console.log(`Fetching: ${url}`);
  await page.goto(url, { waitUntil: "load" });

  const data = await page.$$eval(".product a", (nodes) =>
    nodes.map((e) => ({
      label: e.textContent,
      href: e.href,
    }))
  );

  await page.close();
  return { year, cameras: data };
};

(async () => {
  let browser = await puppeteer.launch();
  await build(YEARS, mapper.bind(null, browser), "build/camera-links.json");
  await browser.close();
})();
