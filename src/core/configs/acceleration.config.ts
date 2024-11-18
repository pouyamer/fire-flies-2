import { AccelerationType } from "../enums";
import { AccelerationConfig } from "../types";

export const accelerationConfig: AccelerationConfig = {
  type: AccelerationType.Cartesian,
  accX: {
    min: -.02,
    max: .02
  },
  accY:  {
    min: -.02,
    max: .02
  }
}
