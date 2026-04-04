import { HslColorConfig } from "../types";
import { Utilities } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: 200,
    // nextValueFn: ({ firefly }) => {
    //   return 20
    // },
  },
  saturation: {
    value: Utilities.range(60, 80),
  },
  lightness: {
    value: Utilities.range(50, 65),
  },
  alpha: {
    value: 1,
  },
}