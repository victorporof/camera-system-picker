import { promises as fs } from "fs";
import { minify } from "html-minifier";
import string from "string";

import got from "got";

import cameras from "../data/input-cameras.json";
import scrapData from "./scrap-data";

const DATE_RE = /<span.*?>Announced<\/span>\s*(.*?)\s*&bull;/im;
const MSRP_RE = /<th class="label">MSRP<\/th><td class="value">\s*(.*?)\s*<\/td>/im;
const WEIGHT_RE = /<th class="label">Weight.*?<\/th><td class="value">\s*([\d\.]+)\s*<span class="unitsSuffix">\s*(.*?)\s*<\/span>.*?<\/td>/im;
const TYPE_RE = /<th class="label">Body type<\/th><td class="value">\s*(.*?)\s*<\/td>/im;
const MOUNT_RE = /<th class="label">Lens mount<\/th><td class="value">\s*(.*?)\s*<\/td>/im;
const SENSOR_RE = /<th class="label">Sensor size<\/th><td class="value">\s*(.*?)\s*\((.*?)\)\s*<\/td>/im;
const FOCAL_RE = /<th class="label">Focal length.*?<\/th><td class="value">\s*(?:([\d\.]+)\s*&ndash;\s*([\d\.]+)|([\d\.]+))\s*<span class="unitsSuffix">\s*(.*?)\s*<\/span>/im;

const mapper = async (camera, index) => {
  const response = await got(`${camera.href}/specifications`);
  const body = minify(response.body, { collapseWhitespace: true });
  const [, date] = body.match(DATE_RE) || [];
  const [, msrp] = body.match(MSRP_RE) || [];
  const [, weight, weightUnit] = body.match(WEIGHT_RE) || [];
  const [, type] = body.match(TYPE_RE) || [];
  const [, mount] = body.match(MOUNT_RE) || [];
  const [, sensorType, sensorSize] = body.match(SENSOR_RE) || [];
  const [, focalNear, focalFar, focal, focalUnit] = body.match(FOCAL_RE) || [];

  const scrap = {
    ...camera,
    date: string(date || "?").unescapeHTML().s,
    msrp: string(msrp || "?").unescapeHTML().s,
    weight: string(weight || "?").unescapeHTML().s,
    weightUnit: string(weightUnit || "?").unescapeHTML().s,
    type: string(type || "?").unescapeHTML().s,
    mount: string(mount || "?").unescapeHTML().s,
    sensor: {
      type: string(sensorType || "?").unescapeHTML().s,
      size: string(sensorSize || "?").unescapeHTML().s
    },
    focal: mount ? null : [focalNear || focal || "?", focalFar || focal || "?"],
    focalUnit: mount ? null : string(focalUnit || "?").unescapeHTML().s
  };

  console.log(index, scrap);
  return scrap;
};

scrapData(cameras, mapper, "out/scrap.json");
