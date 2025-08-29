import { ChangeType } from "../enums"
import { ChangingValueConfig } from "../types"
import { Utilities } from "../utilities"


export const hueConfig: ChangingValueConfig = {
  type: ChangeType.NoChange,
  value: [
    {
      value: 10,
      weight: 3
    },
    {
      value: 20,
      weight: 3
    },
    {
      value: 30,
      weight: 3
    },
    {
      value: 40,
      weight: 2
    },
    {
      value: 50,
      weight: 1
    },
  ]
}