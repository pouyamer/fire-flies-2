import { DrawConfig } from "../types";
import { Utilities } from "../utilities";

export const drawConfig: DrawConfig = {
  clearBeforeDrawing: true,
  iterationPerFrame: 1,
  method: {
    lineWidth: Utilities.range(1, 10),
    value: 'stroke'
  },
}