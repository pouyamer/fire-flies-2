import { PI } from "../constants";
import { CONSTANTS } from "../constants/constants";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  applyPositionCorrection: {
    bottom: true,
    left: true,
    right: true,
    top: true
  },
  onFireflyTouchedBounds: {
    all: ({firefly, api}) => {
      // api('methods').resetServicesOnFireflyByKeys(firefly, 'location', 'polarSpeedAngle')
      firefly.polarSpeedAngle.set(v => Math.random() * 30)
      firefly.polarSpeedAmount.set(v => v / 2)
      firefly.polarSpeedAmount.resetIteration()
    }
  }

}