import { ChangeType, ChangingValueMethod } from "../enums";

export class ChangingNumericalValueItem {
  changeType: ChangeType;
  decrement: number;
  increment: number;
  maxPossible: number | null;
  minPossible: number | null;
  value: number;
  method: ChangingValueMethod;

  constructor(model: Partial<ChangingNumericalValueItem> = {}) {
    this.changeType = model.changeType ?? ChangeType.NoChange;
    this.decrement = model.decrement ?? 0;
    this.increment = model.increment ?? 0;
    this.maxPossible = model.maxPossible ?? null;
    this.minPossible = model.minPossible ?? null;
    this.value = model.value ?? 0;
    this.method = model.method ?? ChangingValueMethod.None;
  }
}