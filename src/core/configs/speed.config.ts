import { ServiceName, SpeedType } from "../enums";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

const ALL_ANGLES = {
  min: 0,
  max: 2 * Math.PI
}

export const speedConfig: SpeedConfig = {
  name: ServiceName.Speed,
  type: SpeedType.Cartesian,
  speedX:0,
  speedY: 0
}