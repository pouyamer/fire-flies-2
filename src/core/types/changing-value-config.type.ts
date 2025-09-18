import { EventCallBack } from "./event-callback.type";
import { ValueGeneratorParameters } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type";

export type ChangingValueConfig = {
  value: PossibleValue<number>;
  nextValueFn?: (parameters: ValueGeneratorParameters & { current: number }) => number;
  max?: PossibleValue<number>;
  min?: PossibleValue<number>;
  onMax?: EventCallBack;
  onMin?: EventCallBack;
}