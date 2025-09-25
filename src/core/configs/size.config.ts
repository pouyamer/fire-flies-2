import { ChangingValueConfig } from "../types";
import { Utilities } from "../utilities";

export const sizeConfig: ChangingValueConfig = {
  value: Utilities.range(1, 15),
  max: 20
}