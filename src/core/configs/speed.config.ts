import { SpeedConfig } from "../types";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: 0,
    nextValueFn: ({currentFirefly}) => (1- currentFirefly.alpha.value) * 2 
  },
  polarSpeedAngle: {
    value: 0,
  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,

  },
}