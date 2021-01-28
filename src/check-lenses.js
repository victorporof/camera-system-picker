import moment from "moment";

import * as Fix from "./fix";
import lenses from "../build/lens-data";

const logInvalidDates = () => {
  let values = lenses.filter(
    (e) => moment(e.date, "MMM DD, YYYY").toDate() == "Invalid Date"
  );
  console.log(values);
};

const logInvalidWeights = () => {
  let nans = lenses.filter((e) => isNaN(parseInt(e.weight)));
  let other = lenses.filter((e) => parseInt(e.weight) < 10);
  console.log(nans);
  console.log(other);
};

const logMounts = () => {
  let set = new Set();
  let unique = lenses.filter((e) => {
    let seen = set.has(e.mount);
    set.add(e.mount);
    return !seen;
  });
  console.log(unique.map((e) => e.mount).sort());
};

const logMounts2 = () => {
  let broken = lenses.filter((e) => e.mount == "?");
  console.log(broken);
};

const logFocalLenghts = () => {
  let set = new Set();
  let unique = lenses.filter((e) => {
    let seen = set.has(`${e.focal}`);
    set.add(`${e.focal}`);
    return !seen;
  });
  console.log(unique.map((e) => e.focal).sort());
};

const logFocalLenghts2 = () => {
  let broken = lenses.filter(
    (e) =>
      e.focal == "?" &&
      !e.label.toLowerCase().includes("converter") &&
      !e.label.toLowerCase().includes("extender")
  );
  console.log(broken);
};

const logFstops = () => {
  let set = new Set();
  let unique = lenses.filter((e) => {
    let seen = set.has(`${e.fStop}`);
    set.add(`${e.fStop}`);
    return !seen;
  });
  console.log(unique.map((e) => e.fStop).sort());
};

const logFstops2 = () => {
  let broken = lenses.filter(
    (e) =>
      e.fStop == "?" &&
      !e.label.toLowerCase().includes("converter") &&
      !e.label.toLowerCase().includes("extender")
  );
  console.log(broken);
};

const logUniqueMounts = () => {
  let set = new Set();
  let unique = lenses
    .flatMap((e) => (e.mount == "?" ? [] : e.mount))
    .filter((e) => {
      let seen = set.has(e);
      set.add(e);
      return !seen;
    });
  console.log(unique.sort());
};

Fix.fixFocalLengths(lenses);
Fix.fixFStops(lenses);
Fix.sanitizeFocalLengths(lenses);
Fix.sanitizeFStops(lenses);
Fix.sanitizeMounts(lenses);

logInvalidDates();
logInvalidWeights();
logMounts();
logMounts2();
logFocalLenghts();
logFocalLenghts2();
logFstops();
logFstops2();
logUniqueMounts();
