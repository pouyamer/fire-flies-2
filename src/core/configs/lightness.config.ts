import { ChangingValueConfig } from "../types";
import { Utilities } from "../utilities";

export const lightnessConfig: ChangingValueConfig = {
  value: Utilities.range(10, 55),
}