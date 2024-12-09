import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { Firefly } from "../models";
import { ChangingValueConfig } from "../types";

export const alphaConfig: ChangingValueConfig = {
  name: ServiceName.Alpha,
  type: ChangeType.FlipFlop,
  increment: {
    min: 0.001,
    max: 0.003
  },
  maxPossibleValue: 1, 
  value: 0,
  decrement: {
    min: .003,
    max: .006
  },
  minPossibleValue: .3,
  startingMethod: ChangingValueMethod.Decrement

}