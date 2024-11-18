import { ChangeType, ChangingValueMethod } from "../enums";
import { ChangingValueConfig } from "../types";

export const hueConfig: ChangingValueConfig = {
  type: ChangeType.FlipFlop,
  value: 330,
  increment: {
    min: .1,
    max: .4
  },
  maxPossibleValue: 360,
  decrement: {
    min: .2,
    max: .8
  },
  minPossibleValue: 330,
  startingMethod: ChangingValueMethod.Increment
}