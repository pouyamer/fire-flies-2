import { ChangeType, ChangingValueMethod } from "../enums"
import { Firefly, Range } from "../models"

export type ChangingValueConfig = {
  type: ChangeType.NoChange;
  value: number | Range;
} | {
  type: ChangeType.Incremental;
  value: number | Range;
  increment: number | Range;
  maxPossibleValue: number | Range;
} | {
  type: ChangeType.Decremental;
  value: number | Range;
  decrement: number | Range;
  minPossibleValue: number | Range;
} |
{
  type: ChangeType.FlipFlop;
  value: number | Range,
  startingMethod: ChangingValueMethod;
  increment: number | Range;
  decrement: number | Range,
  minPossibleValue: number | Range;
  maxPossibleValue: number | Range;
} | {
  type: ChangeType.ChangeCallback;
  value: number | Range;
  changer: (value: Firefly) => number;
}