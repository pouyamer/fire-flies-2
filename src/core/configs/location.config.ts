import { ServiceName } from "../enums";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  name: ServiceName.Location,
  x: ({canvas}) => {
    return canvas.width / 2 + 100;
  },
  y: ({canvas}) => {
    return canvas.height / 2;
  }
}