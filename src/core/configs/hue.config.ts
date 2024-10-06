import { ChangeType, ChangingValueMethod } from "../enums";
import { Firefly } from "../models";
import { ChangingValueConfig } from "../types";

export const hueConfig: ChangingValueConfig = {
  type: ChangeType.ChangeCallback,
  changer: (firefly: Firefly) => {
    return firefly.hue.value + .5
  },
  value: 1
}