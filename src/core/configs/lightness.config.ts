import { ChangeType } from "../enums";
import { ChangingValueConfig } from "../types";

export const lightnessConfig: ChangingValueConfig = {
  type: ChangeType.Decremental,
  value: 33,
  decrement: 1,
  minPossibleValue: 33,
}