export const fixMounts = (cameras) => {
  for (let camera of cameras) {
    if (camera.mount == "?" && camera.focal == "?") {
      if (camera.label.includes("Nikon Z")) {
        camera.mount = "Nikon Z";
      } else if (camera.label.includes("Fujifilm GFX")) {
        camera.mount = "Fujifilm G";
      } else if (camera.label.includes("Leica M")) {
        camera.mount = "Leica M";
      }
    }
  }
};

export const fixFocalLengths = (lenses) => {
  for (let lens of lenses) {
    if (lens.focal == "?") {
      let [, focal] = lens.label.match(/(\d+)[mM]{2}/) ?? [];
      lens.focal = focal ? [focal] : "?";
    }
  }
};

export const fixFStops = (lenses) => {
  for (let lens of lenses) {
    if (lens.fStop == "?") {
      if (lens.label.includes("Zeiss")) {
        let [, fStop, focal] = lens.label.match(/(\d+)\/(\d+)/) ?? [];
        lens.focal = focal ? [focal] : "?";
        lens.fStop = fStop ? [fStop] : "?";
      } else {
        let [, fStop] = lens.label.match(/[fF]\s*\/([\d.]+)/) ?? [];
        lens.fStop = fStop ? [fStop] : "?";
      }
    }
  }
};

export const sanitizeFocalLengths = (lenses) => {
  for (let lens of lenses) {
    if (lens.focal != "?") {
      lens.focal[1] ??= lens.focal[0];
    }
  }
};

export const sanitizeFStops = (lenses) => {
  for (let lens of lenses) {
    if (lens.fStop != "?") {
      lens.fStop[1] ??= lens.fStop[0];
    }
  }
};

export const sanitizeMounts = (lenses) => {
  for (let lens of lenses) {
    if (lens.mount != "?") {
      lens.mount = lens.mount.split(",").map((e) => e.trim());
    }
  }
};
