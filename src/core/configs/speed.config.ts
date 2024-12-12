import { ServiceName, SpeedType } from "../enums";
import { SpeedConfig } from "../types";

export const speedConfig: SpeedConfig = {
  name: ServiceName.Speed,
  type: SpeedType.Polar,
  angle_PI: {
    min: 0,
    max: Math.PI * 2,
  },
  speed: 1
}