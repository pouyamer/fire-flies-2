import { ChangingValueConfig } from "../types";

export class ChangingNumericalValueItem {
  max: number | null;
  min: number | null;
  private _value: number = 0;
  nextValueFn: ChangingValueConfig["nextValueFn"] | null;

  constructor(model: Partial<Omit<ChangingNumericalValueItem, 'value'>> = {}) {
    this.max = model.max ?? null;
    this.min = model.min ?? null;
    this.nextValueFn = model.nextValueFn ?? null;
  }

  public get value() {
    return this._value;
  }

  public set(value: number | ((v: number) => number)) {
    this._value = typeof value === 'number' ? value : value(this._value)
  }
}