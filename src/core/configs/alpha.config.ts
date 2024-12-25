import { ChangeType, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const alphaConfig: ChangingValueConfig = {
  name: ServiceName.Alpha,
  type: ChangeType.Decremental,
  decrement: {
    min: 0.0,
    max: 0.0
  },
  minPossibleValue: 0,
  value: {
    min: 0,
    max: 1
  },
  onMinReached: (ff, c, ffs, a) => {
    a.setServicesOnSingleFirefly(ff)
  }
  
}