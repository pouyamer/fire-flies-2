import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { BoundsConfig } from "../types";

export const boundsConfig: BoundsConfig = {
  ...CONSTANTS.CANVAS_EDGE_BOUNDS,
  onFireflyOutOfBounds: {
    all: ({app, firefly}) => {
      // app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.Location);
      firefly.polarSpeedAmount.set(v => v*= 1.001)
      // firefly.setValue('polarSpeedAmount', (v) => v + 1)
      firefly.polarSpeedAngle.set(Math.random());
      
      app.setServicesOnSingleFireflyByServiceNames(firefly, ServiceName.Location, ServiceName.Hue, ServiceName.Rotation, ServiceName.Size, ServiceName.Lightness);

      firefly.speedY.resetIteration();
      firefly.speedY.set(0);
      firefly.speedY.nextValueFn = null;
    },
  },
  applyPositionCorrection: {
    bottom: false,
    left: false,
    right:false,
    top: false,
  },
  onFireflyTouchedBounds: {
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