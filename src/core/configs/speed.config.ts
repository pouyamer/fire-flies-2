import { SpeedType } from "../enums";
import { SpeedConfig } from "../types";

export const speedConfig: SpeedConfig = {
  type: SpeedType.Polar,
  angle_PI: {
    min: 0,
    max: Math.PI * 2
  },
  speed: {
    min: 1,
    max: 4
  }

}