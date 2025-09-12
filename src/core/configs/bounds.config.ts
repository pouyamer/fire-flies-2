import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: ({app, currentFirefly}) => {
      app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location)
    },
  },
  applyPositionCorrection: {
    bottom: false,
    left: false,
    right:false,
    top: false,
  },

}