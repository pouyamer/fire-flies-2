import { EventCallBack } from "./event-callback.type";
import { ValueGenerator } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type"

export type LifeConfig = {
  value: PossibleValue<number>;
  codeGenerator: () => string;
  nextValueFn?: ValueGenerator<number>;
  onFireflyDead?: EventCallBack;
}