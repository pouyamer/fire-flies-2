import { RgbColorConfig } from "../types";
import { Utilities } from "../utilities";

export const rgbColorConfig: RgbColorConfig = {
  red: {
    value: Utilities.range(50, 255),
  },
  green: {
    value: Utilities.range(127, 255),
  },
  blue: {
    value: Utilities.range(89, 255),
  },
  alpha: {
    value: 1,
  }
}