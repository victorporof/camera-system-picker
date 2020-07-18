import { promises as fs } from "fs";

import delay from "delay";

export default async (data, mapper, out) => {
  try {
    await fs.truncate(out, 0);
  } catch (e) {}

  await fs.appendFile(out, `[`);

  for (let i = 0; i < data.length; i++) {
    const scrap = await mapper(data[i], i);
    await fs.appendFile(out, `${JSON.stringify(scrap, null, 2)},\n`);
    await delay(1000);
  }

  await fs.appendFile(out, `]`);
};
