import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export const speedConfig: SpeedConfig = {
  polarSpeedAmount: {
    value: Array.from({length: 200}).map((_, i) => (i + 1) / 8),
    // nextValueFn: ({current}) => current - .001,
    // max: 40,
    // onMax: ({firefly}) => {
    //   firefly.polarSpeedAmount.nextValueFn = ({current}) => current;
    // },
    // min: -40,
    // onMin:  ({firefly}) => {
    //   firefly.polarSpeedAmount.nextValueFn = ({current}) => current + Utilities.getRandomNumberBetween(
    //     Utilities.range(.00006, .0006)
    //   );
    // },
  },
  polarSpeedAngle: {
    value: Utilities.range(0, 2 * Math.PI),
    nextValueFn: ({ current }) => current

  },
  speedX: {
    value: 0,
  },
  speedY: {
    value: 0,
  },
}