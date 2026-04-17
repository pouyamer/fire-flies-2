import { EventCallBackWithFirefly } from "./event-callback.type";
import { ValueGeneratorWithFirefly } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type"

export type LifeConfig = {
  value: PossibleValue<number>;
  codeGenerator: () => string;
  nextValueFn?: ValueGeneratorWithFirefly<number>;
  onFireflyDead?: EventCallBackWithFirefly;
}