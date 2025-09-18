import { ChangingValueConfig, ValueGenerator } from "../types";

export class ChangingNumericalValueItem {
  max: number | null;
  min: number | null;
  value: number;
  nextValueFn: ChangingValueConfig["nextValueFn"] | null;

  constructor(model: Partial<ChangingNumericalValueItem> = {}) {
    this.max = model.max ?? null;
    this.min = model.min ?? null;
    this.value = model.value ?? 0;
    this.nextValueFn = model.nextValueFn ?? null;
  }
}