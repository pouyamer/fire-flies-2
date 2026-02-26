import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyTouchedBounds: {
    all: ({app, firefly}) => {
      // app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.Location);
    },
  },
  applyPositionCorrection: {
    bottom: false,
    left: false,
    right:false,
    top: false,
  },
  onFireflyOutOfBounds: {
    // all: ({app, firefly}) => {
    //   if (Math.abs(firefly.speedX.value) < 1 || Math.abs(firefly.speedY.value) < 1) {
    //     app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.Location);
    //     app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.PolarSpeedAmount);
    //     app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.PolarSpeedAngle);
    //   }
    // },
    // bottom: ({firefly}) => {
    //   firefly.speedY.value = -1 *firefly.speedY.value;
    // },
    // top: ({firefly}) => {
    //   firefly.speedY.value = -1 *firefly.speedY.value;
    // },
    // left: ({firefly}) => {
    //   firefly.speedX.value = -1 *firefly.speedX.value;
    // },
    // right: ({firefly}) => {
    //   firefly.speedX.value = -1 *firefly.speedX.value;
    // },
  }

}