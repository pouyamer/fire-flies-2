export class ChangingNumericalValueItem {
  decrement: number;
  increment: number;
  max: number | null;
  min: number | null;
  value: number;

  constructor(model: Partial<ChangingNumericalValueItem> = {}) {
    this.decrement = model.decrement ?? 0;
    this.increment = model.increment ?? 0;
    this.max = model.max ?? null;
    this.min = model.min ?? null;
    this.value = model.value ?? 0;
  }
}