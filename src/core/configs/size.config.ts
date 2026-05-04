import { ChangingValueConfig } from "../types";
import { range } from "../utilities";

export const sizeConfig: ChangingValueConfig = {
  value: range(10, 20),
  // nextValueFn: ({firefly}) => Math.abs(firefly.polarSpeedAmount.value) /3 , 
}