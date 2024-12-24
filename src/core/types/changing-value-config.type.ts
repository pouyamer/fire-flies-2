import { ChangeType, ChangingValueMethod } from "../enums"
import { Range } from "../models"
import { BaseConfig } from "./base-config.type";
import { EventCallBack } from "./event-callback.type";
import { PossibleValue } from "./possible-value.type";

export type ChangingValueConfig = BaseConfig & ({
  type: ChangeType.NoChange;
  value: PossibleValue;
} | {
  type: ChangeType.Incremental;
  value: PossibleValue;
  increment: PossibleValue;
  maxPossibleValue: PossibleValue;
  onMaxReached?: EventCallBack;
} | {
  type: ChangeType.Decremental;
  value: PossibleValue;
  decrement: PossibleValue;
  minPossibleValue: PossibleValue;
  onMinReached?: EventCallBack;
} |
{
  type: ChangeType.FlipFlop;
  value: PossibleValue,
  startingMethod: ChangingValueMethod;
  increment: PossibleValue;
  decrement: PossibleValue,
  minPossibleValue: PossibleValue;
  maxPossibleValue: PossibleValue;
  onMaxReached?: EventCallBack;
  onMinReached?: EventCallBack;
})