import { CONSTANTS } from "../constants/constants";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: ({firefly, app}) => {
      app.resetServicesOnFireflyByKeys(firefly, 'location')
    }
  }

}