import { ChangeType, ChangingValueMethod } from "../enums"
import { Firefly, Range } from "../models"
import { BaseConfig } from "./base-config.type";
import { EventCallBack } from "./event-callback.type";

export type ChangingValueConfig = BaseConfig & ({
  type: ChangeType.NoChange;
  value: number | Range;
} | {
  type: ChangeType.Incremental;
  value: number | Range;
  increment: number | Range;
  maxPossibleValue: number | Range;
  onMaxReached?: EventCallBack;
} | {
  type: ChangeType.Decremental;
  value: number | Range;
  decrement: number | Range;
  minPossibleValue: number | Range;
  onMinReached?: EventCallBack;
} |
{
  type: ChangeType.FlipFlop;
  value: number | Range,
  startingMethod: ChangingValueMethod;
  increment: number | Range;
  decrement: number | Range,
  minPossibleValue: number | Range;
  maxPossibleValue: number | Range;
  onMaxReached?: EventCallBack;
  onMinReached?: EventCallBack;
} | {
  type: ChangeType.ChangeCallback;
  value: number | Range;
  changer: (value: Firefly) => number;
}) 