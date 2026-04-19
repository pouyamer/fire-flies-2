import { SpeedConfig } from "../types";
import { range } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: 3,
    nextValueFn: ({current}) => current + .01
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