import { ServiceName } from "../enums";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  name: ServiceName.Location,
  x: (ff, c, ffs, a) => {
    return c.width / 2 + 100;
  },
  y: (ff, c, ffs, a) => {
    return c.height / 2;
  }
}