import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: Utilities.range(2),
  },
  polarSpeedAngle: {
    value: Utilities.range(0, 2 * Math.PI),

  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,

  },
}