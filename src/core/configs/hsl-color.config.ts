import { HslColorConfig } from "../types";
import { range } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: 200,
  },
  saturation: {
    value: range(60, 80),
  },
  lightness: {
    value: range(50, 65),
  },
  alpha: {
    value: 1,
  },
}