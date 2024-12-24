import { ServiceName } from "../enums";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  name: ServiceName.Location,
  x: (ff, c, ffs, a) => {
    return Math.random() * c.width;
  },
  y: (ff, c, ffs, a) => {
    return Math.random() * c.height;
  }
}