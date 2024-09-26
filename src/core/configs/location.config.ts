import { LocationSetMethod } from "../enums";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  type: LocationSetMethod.CanvasRelativeCallback,
  locationSetter(canvasWidth, canvasHeight) {
    const x = Math.sin(Math.random()) * canvasWidth;
    const y = Math.random() * canvasHeight;

    return [x, y]
  },
}