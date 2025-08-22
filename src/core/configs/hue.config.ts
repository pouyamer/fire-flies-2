import { ChangeType } from "../enums"
import { ChangingValueConfig } from "../types"
import { Utilities } from "../utilities"


export const hueConfig: ChangingValueConfig = {
  type: ChangeType.NoChange,
  value: Utilities.range(0, 360)
}