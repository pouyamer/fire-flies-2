import { CONSTANTS } from "../constants/constants";
import { SpeedType } from "../enums";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: 1,
  },
  polarSpeedAngle: {
    value: () => CONSTANTS.Ranges.ALL_ANGLES,
  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,

  },
}