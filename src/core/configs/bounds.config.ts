import { CONSTANTS } from "../constants/constants";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyTouchedBounds: {
    all: ({currentFirefly: ff}) => {
      ff.hue.value = 100
    },
    bottom: ({currentFirefly: ff}) => {
      ff.speedY = -.8 *ff.speedY;
    },
    top: ({currentFirefly: ff}) => {
      ff.speedY = -.8 *ff.speedY;
    },
    right: ({currentFirefly: ff}) => {
      ff.speedX = -.8 *ff.speedX;
    },
    left: ({currentFirefly: ff}) => {
      ff.speedX = -.8 *ff.speedX;
    },
  },
  applyPositionCorrection: {
    bottom: true,
    left: true,
    right: true,
    top: true,
  },
  onFireflyOutOfBounds: ({currentFirefly, app}) => {
  }

}