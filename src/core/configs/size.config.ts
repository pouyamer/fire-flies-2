import { ChangeType, ChangingValueMethod } from "../enums";
import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  type: ChangeType.FlipFlop,
  value: 0,
  increment: {
    min: .2,
    max: .5
  },
  maxPossibleValue: 50,
  minPossibleValue: {
    min: 10,
    max: 20
  },
  decrement: {
    min: .3,
    max: .6
  },
  startingMethod: ChangingValueMethod.Increment
}