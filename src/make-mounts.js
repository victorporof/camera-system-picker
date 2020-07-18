import { promises as fs } from "fs";
import uniq from "lodash/uniq";
import flatten from "lodash/flatten";

import scrap from "../data/scrap-lenses.json";
import parseMounts from "./parse-mounts";

(async () => {
  await fs.writeFile(
    "out/mounts.json",
    JSON.stringify(uniq(flatten(scrap.map(parseMounts))).sort())
  );
})();
