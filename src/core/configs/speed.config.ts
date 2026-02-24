import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: Utilities.range(2),
    nextValueFn: ({current}) => current + .09,
    max: 2,
    onMax: ({currentFirefly}) => {
      currentFirefly.polarSpeedAmount.nextValueFn = ({current}) => current - Utilities.getRandomNumberBetween(
        Utilities.range(0, .09)
      );
    },
    min: -4,
    onMin:  ({currentFirefly}) => {
      currentFirefly.polarSpeedAmount.nextValueFn = ({current}) => current + Utilities.getRandomNumberBetween(
        Utilities.range(0, .09)
      );
    },
  },
  polarSpeedAngle: {
    value: Utilities.range(0, 2 * Math.PI),
    nextValueFn: ({ current }) => current + Utilities.getRandomNumberBetween(
      Utilities.range(.1)
    )

  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,
  },
}