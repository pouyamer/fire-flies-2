import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyTouchedBounds: {
    all: () => {
      // app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location)
    },
  },
  applyPositionCorrection: {
    bottom: false,
    left: false,
    right:false,
    top: false,
  },
  onFireflyOutOfBounds: {
    all: ({app, currentFirefly}) => {
      if (Math.abs(currentFirefly.speedX.value) < 1 || Math.abs(currentFirefly.speedY.value) < 1) {
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location);
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.PolarSpeedAmount);
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.PolarSpeedAngle);
      }
    },
    bottom: ({currentFirefly}) => {
      currentFirefly.speedY.value = -1 *currentFirefly.speedY.value;
    },
    top: ({currentFirefly}) => {
      currentFirefly.speedY.value = -1 *currentFirefly.speedY.value;
    },
    left: ({currentFirefly}) => {
      currentFirefly.speedX.value = -1 *currentFirefly.speedX.value;
    },
    right: ({currentFirefly}) => {
      currentFirefly.speedX.value = -1 *currentFirefly.speedX.value;
    },
  }

}