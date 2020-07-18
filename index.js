import findLenses from "./src/find-lenses";
import findCameras from "./src/find-cameras";

// console.log(
//   findLenses({
//     focal: {
//       covered: [16, 35],
//       tolerances: [[-6, 3], [-11, 100]],
//       cropped: false
//     },
//     exclude: {
//       labels: [/fish-?eye/i],
//       mounts: [/pentax|nikon 1|four thirds|minolta/i],
//       weights: [/\?/i]
//     },
//     sorted: {
//       byDate: true,
//       byWeight: true
//     }
//   })
// );

// console.log(
//   findLenses({
//     focal: {
//       covered: [70, 130],
//       tolerance: [-20, 20]
//     },
//     include: {
//       labels: [/sony/i]
//     },
//     exclude: {
//       weights: [/\?/i]
//     },
//     sorted: {
//       byDate: true,
//       byWeight: true
//     }
//   })
// );

console.log(
  findCameras({
    include: {
      mounts: [/nikon/i],
      sensors: [/full frame/i]
    },
    exclude: {
      weights: [/\?/i]
    },
    sorted: {
      byWeight: true
    }
  })
);
