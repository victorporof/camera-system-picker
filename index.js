import findLenses from "./src/find-lenses";
import findCameras from "./src/find-cameras";

// console.log(
//   findCameras({
//     include: {
//       mounts: [/nikon/i],
//       sensors: [/full frame/i],
//     },
//     exclude: {
//       weights: [/\?/i],
//     },
//     sorted: {
//       byWeight: true,
//     },
//   })
// );

// console.log(
//   findLenses({
//     focal: {
//       covered: [14, 35],
//       tolerances: [
//         [-4, 3],
//         [-5, 100],
//       ],
//       cropped: false,
//     },
//     exclude: {
//       labels: [/fish-?eye/i],
//       mounts: [/pentax|nikon 1|four thirds|minolta/i],
//       weights: [/\?/i],
//     },
//     sorted: {
//       byDate: true,
//       byWeight: true,
//     },
//   })
// );

console.log(
  findLenses({
    focal: {
      covered: [28],
      tolerances: [[-2, 2]],
      cropped: false,
    },
    fStop: {
      covered: [1.8],
      tolerance: [-0.85, 0.2],
    },
    exclude: {
      weights: [/\?/i],
    },
    sorted: {
      byDate: true,
    },
  })
);
