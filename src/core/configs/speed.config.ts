import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: 0,
  },
  polarSpeedAngle: {
    value: 0,
  },
  speedX: {
    value: Utilities.range(.1, 20),
  },
  speedY: {
    value: Utilities.range(.1, 20),

  },
}