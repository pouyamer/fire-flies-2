import { PossibleValue } from "./possible-value.type";

export type JitterConfig = {
  jitterX: PossibleValue<number>;
  jitterY: PossibleValue<number>
}