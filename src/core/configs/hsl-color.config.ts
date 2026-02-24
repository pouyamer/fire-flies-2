import { HslColorConfig } from "../types";
import { Utilities } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: [360, 10],
  },
  saturation: {
    value: Utilities.range(60, 80),
  },
  lightness: {
    value: Utilities.range(45, 55),
  },
  alpha: {
    value: 1,
    nextValueFn: ({currentFirefly: ff}) => {
      return ff.size.value / 10
    }
  },
}