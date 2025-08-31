import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  value: 400,
  nextValueFn: ({currentFirefly}) => {
    return Math.max(currentFirefly.hue.value, 0) ;
  },
}