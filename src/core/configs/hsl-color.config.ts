import { HslColorConfig } from "../types";
import { Utilities } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: Utilities.range(0, 50),
  },
  saturation: {
    value: Utilities.range(60, 60),
  },
  lightness: {
    value: Utilities.range(45, 55),
  },
  alpha: {
    value: Utilities.range(0, 1)
  },
}