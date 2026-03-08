import { ChangingValueConfig } from "../types";
import { Utilities } from "../utilities";

export const sizeConfig: ChangingValueConfig = {
  value: Utilities.range(10, 30),
  // nextValueFn: ({firefly}) => Math.abs(firefly.polarSpeedAmount.value) /3 , 
}