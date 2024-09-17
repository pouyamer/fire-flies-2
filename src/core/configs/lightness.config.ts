import { ChangeType } from "../enums";
import { ChangingValueConfig } from "../types";

export const lightnessConfig: ChangingValueConfig = {
  type: ChangeType.NoChange,
  value: {
    min: 40,
    max: 70
  },
}