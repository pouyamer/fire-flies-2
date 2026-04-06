import { CONSTANTS } from "../constants/constants";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: ({firefly, api}) => {
      api('app').resetServicesOnFireflyByKeys(firefly, 'location')
    }
  }

}