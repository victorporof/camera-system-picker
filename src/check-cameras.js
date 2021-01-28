import moment from "moment";

import * as Fix from "./fix";
import cameras from "../build/camera-data";

const logInvalidDates = () => {
  let values = cameras.filter(
    (e) => moment(e.date, "MMM DD, YYYY").toDate() == "Invalid Date"
  );
  console.log(values);
};

const logInvalidMsrps = () => {
  let nans = cameras.filter((e) => isNaN(parseInt(e.msrp.substring(1))));
  let other = cameras.filter((e) => parseInt(e.msrp.substring(1)) < 100);
  console.log(nans);
  console.log(other);
};

const logInvalidWeights = () => {
  let nans = cameras.filter((e) => isNaN(parseInt(e.weight)));
  let other = cameras.filter((e) => parseInt(e.weight) < 10);
  console.log(nans);
  console.log(other);
};

const logTypes = () => {
  let set = new Set();
  let unique = cameras.filter((e) => {
    let seen = set.has(e.type);
    set.add(e.type);
    return !seen;
  });
  console.log(unique.map((e) => e.type).sort());
};

const logTypes2 = () => {
  let broken = cameras.filter((e) => e.type == "?");
  console.log(broken);
};

const logMounts = () => {
  let set = new Set();
  let unique = cameras.filter((e) => {
    let seen = set.has(e.mount);
    set.add(e.mount);
    return !seen;
  });
  console.log(unique.map((e) => e.mount).sort());
};

const logMounts2 = () => {
  let broken = cameras.filter(
    (e) =>
      e.mount == "?" &&
      e.focal == "?" &&
      e.type != "?" &&
      e.type != "Compact" &&
      e.type != "Ultracompact" &&
      e.type != "VR/Action camera"
  );
  console.log(broken);
};

const logSensors = () => {
  let set = new Set();
  let unique = cameras.filter((e) => {
    let seen = set.has(e.sensor.type);
    set.add(e.sensor.type);
    return !seen;
  });
  console.log(unique.map((e) => e.sensor));
};

const logSensors2 = () => {
  let broken = cameras.filter(
    (e) =>
      e.sensor.type == "?" &&
      e.type != "?" &&
      e.type != "Compact" &&
      e.type != "Ultracompact" &&
      e.type != "VR/Action camera"
  );
  console.log(broken);
};

Fix.fixMounts(cameras);

logInvalidDates();
logInvalidMsrps();
logInvalidWeights();
logTypes();
logTypes2();
logMounts();
logMounts2();
logSensors();
logSensors2();
