import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: ({firefly, app}) => {
      app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.Location)
    }
  }

}