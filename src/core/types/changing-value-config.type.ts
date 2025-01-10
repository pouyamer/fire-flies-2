import { ChangeType, ChangingValueMethod } from "../enums"
import { Range } from "../models"
import { BaseConfig } from "./base-config.type";
import { EventCallBack } from "./event-callback.type";
import { PossibleValue } from "./possible-value.type";

export type ChangingValueConfig = BaseConfig & ({
  type: ChangeType.NoChange;
  value: PossibleValue<number>;
} | {
  type: ChangeType.Incremental;
  value: PossibleValue<number>;
  increment: PossibleValue<number>;
  maxPossibleValue: PossibleValue<number>;
  onMaxReached?: EventCallBack;
} | {
  type: ChangeType.Decremental;
  value: PossibleValue<number>;
  decrement: PossibleValue<number>;
  minPossibleValue: PossibleValue<number>;
  onMinReached?: EventCallBack;
} |
{
  type: ChangeType.FlipFlop;
  value: PossibleValue<number>,
  startingMethod: ChangingValueMethod;
  increment: PossibleValue<number>;
  decrement: PossibleValue<number>,
  minPossibleValue: PossibleValue<number>;
  maxPossibleValue: PossibleValue<number>;
  onMaxReached?: EventCallBack;
  onMinReached?: EventCallBack;
})