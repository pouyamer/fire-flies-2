import { Range } from "../models";
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
    value: 0,
  },
  speedY: {
    value:range(3),
    nextValueFn: ({current}) => current + .07

  },
}