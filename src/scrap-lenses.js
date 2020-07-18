import { minify } from "html-minifier";
import string from "string";

import got from "got";

import lenses from "../data/input-lenses.json";
import scrapData from "./scrap-data";

const DATE_RE = /<span.*?>Announced<\/span>\s*(.*?)\s*&bull;/im;
const WEIGHT_RE = /<th class="label">Weight.*?<\/th><td class="value">\s*([\d\.]+)\s*<span class="unitsSuffix">\s*(.*?)\s*<\/span>.*?<\/td>/im;
const MOUNT_RE = /<th class="label">Lens mount<\/th><td class="value">\s*(.*?)\s*<\/td>/im;
const FOCAL_RE = /<th class="label">Focal length<\/th><td class="value">\s*(?:([\d\.]+)\s*&ndash;\s*([\d\.]+)|([\d\.]+))\s*<span class="unitsSuffix">\s*(.*?)\s*<\/span>/im;
const APERTURE_RE = /<th class="label">Maximum aperture<\/th><td class="value">\s*F(?:([\d\.]+)&ndash;([\d\.]+)|([\d\.]+))\s*<\/td>/im;

const mapper = async (lens, index) => {
  const response = await got(`${lens.href}/specifications`);
  const body = minify(response.body, { collapseWhitespace: true });
  const [, date] = body.match(DATE_RE) || [];
  const [, weight, weightUnit] = body.match(WEIGHT_RE) || [];
  const [, mount] = body.match(MOUNT_RE) || [];
  const [, focalNear, focalFar, focal, focalUnit] = body.match(FOCAL_RE) || [];
  const [, fMin, fMax, fStop] = body.match(APERTURE_RE) || [];

  const scrap = {
    ...lens,
    date: string(date || "?").unescapeHTML().s,
    weight: string(weight || "?").unescapeHTML().s,
    weightUnit: string(weightUnit || "?").unescapeHTML().s,
    mount: string(mount || "?").unescapeHTML().s,
    focal: [focalNear || focal || "?", focalFar || focal || "?"],
    focalUnit: string(focalUnit || "?").unescapeHTML().s,
    fStop: [fMin || fStop || "?", fMax || fStop || "?"]
  };

  console.log(index, scrap);
  return scrap;
};

scrapData(lenses, mapper, "out/scrap.json");
