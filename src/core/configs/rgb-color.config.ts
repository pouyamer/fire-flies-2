import { RgbColorConfig } from "../types";
import { range } from "../utilities";

export const rgbColorConfig: RgbColorConfig = {
  red: {
    value: range(50, 255),
  },
  green: {
    value: range(127, 255),
  },
  blue: {
    value: range(89, 255),
  },
  alpha: {
    value: 1,
  }
}