import { HslColorConfig } from "../types";
import { Utilities } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: Utilities.range(0, 360),
    nextValueFn: ({firefly}) => {
      return (360 * (firefly.polarSpeedAngle.value / (2* Math.PI))) % 360;
    }
  },
  saturation: {
    value: Utilities.range(60, 80),
  },
  lightness: {
    value: Utilities.range(45, 55),
  },
  alpha: {
    value: 1,
    nextValueFn: ({firefly: ff}) => {
      return ff.size.value / 10
    }
  },
}