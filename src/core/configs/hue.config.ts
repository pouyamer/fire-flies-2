import { ChangeType, ServiceName } from "../enums"
import { ChangingValueConfig } from "../types"
import { Utilities } from "../utilities"


export const hueConfig: ChangingValueConfig = {
  name: ServiceName.Hue,
  type: ChangeType.NoChange,
  value: () => {
    return Math.random() < .01 ? 160 : 20
  }
}