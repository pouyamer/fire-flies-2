import { SpeedType } from "../enums";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

const ALL_ANGLES = {
  min: 0,
  max: 2 * Math.PI
}

export const speedConfig: SpeedConfig = {
  type: SpeedType.Cartesian,
  speedY:  Utilities.range(-3, 3),
  speedX: Utilities.range(-3, 3)
}