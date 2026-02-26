import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: Utilities.range(2),
    nextValueFn: ({current}) => current + Utilities.getRandomNumberBetween(
        Utilities.range(.2, .7)
      ),
    max: 1,
    onMax: ({firefly}) => {
      firefly.polarSpeedAmount.nextValueFn = ({current}) => current - Utilities.getRandomNumberBetween(
        Utilities.range(.2, .7)
      );
    },
    min: -3,
    onMin:  ({firefly}) => {
      firefly.polarSpeedAmount.nextValueFn = ({current}) => current + Utilities.getRandomNumberBetween(
        Utilities.range(.2, .7)
      );
    },
  },
  polarSpeedAngle: {
    value: Utilities.range(0, 2 * Math.PI),
    nextValueFn: ({ current }) => current + Utilities.getRandomNumberBetween(
      Utilities.range(0, .01)
    )

  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,
  },
}