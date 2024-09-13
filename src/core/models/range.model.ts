export class Range {
  public min: number;
  public max: number;

  constructor(model: Partial<Range> = {}) {
    this.min = model.min ?? 0;
    this.max = model.max ?? 0;
  }
}