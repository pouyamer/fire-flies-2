import { HslColorConfig } from "../types";
import { range } from "../utilities";

export const hslColorConfig: HslColorConfig = {
  hue: {
    value: range(0, 100),
    nextValueFn: ({current}) => current + Math.random() * 5
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