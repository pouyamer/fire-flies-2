import { ChangeType, ChangingValueMethod } from "../enums";
import { ChangingValueConfig } from "../types";

export const hueConfig: ChangingValueConfig = {
  type: ChangeType.FlipFlop,
  value: 0,
  increment: {
    min: 0.3,
    max: .36,
  },
  decrement: {
    min: .4,
    max: .46
  },
  minPossibleValue: 0,
  startingMethod: ChangingValueMethod.Decrement,
  maxPossibleValue: 40,
}