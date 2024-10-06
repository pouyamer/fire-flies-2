import { SpeedType } from "../enums";
import { Firefly } from "../models";
import { SpeedConfig } from "../types";

export const speedConfig: SpeedConfig = {
  type: SpeedType.Polar,
  angle_PI: {
    min: 0,
    max: 2 * Math.PI
  },
  speed: 1
}