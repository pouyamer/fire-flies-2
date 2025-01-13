import { ServiceName, SpeedType } from "../enums";
import { SpeedConfig } from "../types";

const ALL_ANGLES = {
  min: 0,
  max: 2 * Math.PI
}

export const speedConfig: SpeedConfig = {
  name: ServiceName.Speed,
  type: SpeedType.Polar,
  angle_PI: ALL_ANGLES,
  speed: 0
}