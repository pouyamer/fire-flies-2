import { EventCallBackWithFirefly } from "./event-callback.type";
import { ValueGeneratorWithFireflyParameters } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type";

export type ChangingValueConfig = {
  value: PossibleValue<number>;
  nextValueFn?: (parameters: ValueGeneratorWithFireflyParameters & { current: number; iteration: number }) => number;
  max?: PossibleValue<number>;
  min?: PossibleValue<number>;
  onMax?: EventCallBackWithFirefly;
  onMin?: EventCallBackWithFirefly;
}