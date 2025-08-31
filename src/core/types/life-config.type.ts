import { ValueGenerator } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type"

export type LifeConfig = {
  value: PossibleValue<number>;
  codeGenerator: () => string;
  nextValueFn?: ValueGenerator<number>;
  onFireflyDead?: ValueGenerator<number>;
}