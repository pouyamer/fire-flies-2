import { HslColorConfig } from "../types";
import { range } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: range(0, 360)
  },
  saturation: {
    value: 75,
  },
  lightness: {
    value: 65,
  },
  alpha: {
    value: 1,
  },
}