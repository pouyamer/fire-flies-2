import { ChangeType } from "../enums";
import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  type: ChangeType.Decremental,
  value: 5,
  decrement:1,
  minPossibleValue: 5,
}