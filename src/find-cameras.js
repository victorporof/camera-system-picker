import scrap from "../data/scrap-cameras.json";
import moment from "moment";

export default ({ announced = {}, exclude = {}, include = {}, sorted = {} }) =>
  scrap
    .filter(e =>
      announced.before
        ? moment(e.date, "MMM DD, YYYY").valueOf() <= announced.before
        : true
    )
    .filter(e =>
      announced.after
        ? moment(e.date, "MMM DD, YYYY").valueOf() >= announced.after
        : true
    )
    .filter(e =>
      include.labels
        ? include.labels.every(r => new RegExp(r).test(e.label))
        : true
    )
    .filter(e =>
      include.mounts
        ? include.mounts.every(r => new RegExp(r).test(e.mount))
        : true
    )
    .filter(e =>
      include.sensors
        ? include.sensors.every(r => new RegExp(r).test(e.sensor.type))
        : true
    )
    .filter(e =>
      include.weights
        ? include.weights.every(r => new RegExp(r).test(e.weight))
        : true
    )
    .filter(e =>
      exclude.labels
        ? !exclude.labels.some(r => new RegExp(r).test(e.label))
        : true
    )
    .filter(e =>
      exclude.mounts
        ? !exclude.mounts.some(r => new RegExp(r).test(e.mount))
        : true
    )
    .filter(e =>
      exclude.sensors
        ? !exclude.sensors.some(r => new RegExp(r).test(e.sensor.type))
        : true
    )
    .filter(e =>
      exclude.weights
        ? !exclude.weights.some(r => new RegExp(r).test(e.weight))
        : true
    )
    .sort((a, b) =>
      sorted.byDate
        ? moment(b.date, "MMM DD, YYYY").valueOf() -
          moment(a.date, "MMM DD, YYYY").valueOf()
        : 0
    )
    .sort((a, b) =>
      sorted.byWeight
        ? Number.parseInt(b.weight, 10) - Number.parseInt(a.weight, 10)
        : 0
    );
