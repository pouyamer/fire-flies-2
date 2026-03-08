import { HslColorConfig } from "../types";
import { Utilities } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: Utilities.range(220, 260),
  },
  saturation: {
    value: Utilities.range(60, 80),
  },
  lightness: {
    value: Utilities.range(10, 22),
  },
  alpha: {
    value: 0,
    nextValueFn: ({firefly}) => (firefly.size.value - 10) / 20 
  },
}