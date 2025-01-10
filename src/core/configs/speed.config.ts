import { ServiceName, SpeedType } from "../enums";
import { SpeedConfig } from "../types";

export const speedConfig: SpeedConfig = {
  name: ServiceName.Speed,
  type: SpeedType.Polar,
  angle_PI: ({currentFirefly}) => {
    return ((currentFirefly.hue.value) * 2 * Math.PI) / 360 + (new Date().getSeconds() / 60) * 360
  },
  speed: 3
}