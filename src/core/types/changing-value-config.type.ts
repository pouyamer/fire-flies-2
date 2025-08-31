import { EventCallBack } from "./event-callback.type";
import { ValueGenerator } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type";

export type ChangingValueConfig = {
  value: PossibleValue<number>;
  nextValueFn?: ValueGenerator<number>;
  max?: PossibleValue<number>;
  min?: PossibleValue<number>;
  onMax?: EventCallBack;
  onMin?: EventCallBack;
}