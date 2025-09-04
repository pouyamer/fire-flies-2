import { ChangeType } from "../enums";
import { ChangingValueConfig } from "../types";
import { Utilities } from "../utilities";

export const lightnessConfig: ChangingValueConfig = {
  value: Utilities.range(45, 55),
}