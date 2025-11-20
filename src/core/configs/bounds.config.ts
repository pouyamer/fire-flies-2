import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: () => {
      // app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location)
    },
  },
  applyPositionCorrection: {
    bottom: true,
    left: true,
    right:true,
    top: true,
  },
  onFireflyTouchedBounds: {
    all: ({app, currentFirefly}) => {
      if (Math.abs(currentFirefly.speedX.value) < 1 || Math.abs(currentFirefly.speedY.value) < 1) {
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location);
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.SpeedX);
        app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.SpeedY);
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