import { ChangingValueConfig } from "../types";

export class ChangingNumericalValueItem {
  max: number | null = null;
  min: number | null = null;
  private _value: number = 0;
  private _iteration: number = 0; // is used for acceleration
  private _nextValueFn: ChangingValueConfig["nextValueFn"] | null = null;

  constructor() {}

  public set nextValueFn(value: ChangingNumericalValueItem['_nextValueFn']) {
    this.resetIteration();
    this._nextValueFn = value;
  }

  public get nextValueFn() {
    return this._nextValueFn;
  }

  public get value(): number {
    return this._value;
  }

  public set(value: number | ((v: number) => number)) {
    this._value = typeof value === 'number' ? value : value(this._value)
  }

  public resetIteration(): void {
    this._iteration = 0;
  }

  public iterate(): void {
    this._iteration++;
  }

  public get iteration() {
    return this._iteration;
  }
}