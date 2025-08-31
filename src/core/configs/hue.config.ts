import { ChangeType } from "../enums"
import { ChangingValueConfig } from "../types"
import { Utilities } from "../utilities"


export const hueConfig: ChangingValueConfig = {
  value: 0,
  nextValueFn: ({currentFirefly}) => {
    return currentFirefly.speedY * 9
  }
}