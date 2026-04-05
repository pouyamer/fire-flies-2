import { SpeedConfig } from "../types";
import { range } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: range(2),
  },
  polarSpeedAngle: {
    value: range(0, 2 * Math.PI),

  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,

  },
}