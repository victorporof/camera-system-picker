import moment from "moment";
import range from "lodash/range";

import * as Fix from "./fix";
import lenses from "../build/lens-data";
import cropFactors from "./crop-factors";

Fix.fixFocalLengths(lenses);
Fix.fixFStops(lenses);
Fix.sanitizeFocalLengths(lenses);
Fix.sanitizeFStops(lenses);
Fix.sanitizeMounts(lenses);

export default ({
  focal = {},
  fStop = {},
  announced = {},
  include = {},
  exclude = {},
  sorted = {},
} = {}) =>
  lenses
    .filter((e) =>
      focal.covered && focal.tolerances && e.mount != "?"
        ? e.mount.some((mount) => {
            if (e.focal == "?") {
              return false;
            }
            if (!focal.cropped && cropFactors[mount] > 1) {
              return false;
            }
            const [near, far] = e.focal.map((v) =>
              Math.floor(v * cropFactors[mount])
            );
            return focal.covered.every((length, i) =>
              range(...focal.tolerances[i]).some(
                (delta) => length + delta >= near && length + delta <= far
              )
            );
          })
        : true
    )
    .filter((e) =>
      fStop.covered && fStop.tolerance && e.mount != "?"
        ? e.mount.some((mount) => {
            if (e.fStop == "?") {
              return false;
            }
            const [wide, narrow] = e.fStop.map(
              (v) => Math.round(v * cropFactors[mount] * 100) / 100
            );
            const min = wide + fStop.tolerance[0];
            const max = narrow + fStop.tolerance[1];
            return fStop.covered.every((stop) => stop >= min && stop <= max);
          })
        : true
    )
    .filter((e) =>
      announced.before
        ? moment(e.date, "MMM DD, YYYY").valueOf() <= announced.before
        : true
    )
    .filter((e) =>
      announced.after
        ? moment(e.date, "MMM DD, YYYY").valueOf() >= announced.after
        : true
    )
    .filter((e) =>
      include.labels
        ? include.labels.every((r) => new RegExp(r).test(e.label))
        : true
    )
    .filter((e) =>
      include.mounts
        ? include.mounts.every((r) => new RegExp(r).test(e.mount))
        : true
    )
    .filter((e) =>
      include.weights
        ? include.weights.every((r) => new RegExp(r).test(e.weight))
        : true
    )
    .filter((e) =>
      exclude.labels
        ? !exclude.labels.some((r) => new RegExp(r).test(e.label))
        : true
    )
    .filter((e) =>
      exclude.mounts
        ? !exclude.mounts.some((r) => new RegExp(r).test(e.mount))
        : true
    )
    .filter((e) =>
      exclude.weights
        ? !exclude.weights.some((r) => new RegExp(r).test(e.weight))
        : true
    )
    .sort((a, b) =>
      sorted.byDate
        ? moment(a.date, "MMM DD, YYYY").valueOf() -
          moment(b.date, "MMM DD, YYYY").valueOf()
        : 0
    )
    .sort((a, b) =>
      sorted.byWeight
        ? Number.parseInt(b.weight, 10) - Number.parseInt(a.weight, 10)
        : 0
    );
