import { ChangingValueConfig } from "../types"
import { Utilities } from "../utilities"


export const hueConfig: ChangingValueConfig = {
  value: Utilities.range(0, 360)
}