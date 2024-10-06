import { ChangeType, ChangingValueMethod } from "../enums";
import { Firefly } from "../models";
import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  type: ChangeType.ChangeCallback,
  changer: (firefly: Firefly) => {
    return firefly.x / 75
  },
  value: 2,
}