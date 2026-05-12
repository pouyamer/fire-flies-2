import { TWO_PI } from "../constants/angles.constants";
import { SpeedConfig } from "../types";
import { range } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: 0,
    // nextValueFn: ({current}) => current + .01
  },
  polarSpeedAngle: {
    value: 0,
  },
  speedX: {
    value: 3,

  },
  speedY: {
    value:3,

  },
}