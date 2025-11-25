export class Range {
  public min: number;
  public max: number;

  constructor(min: number, max: number);
  constructor(model: Partial<Range>);
  constructor(first: Partial<Range> | number = {}, second?: number) {
    if(typeof first === 'number') {
      this.min = first;
      this.max = second ?? 0;
    }
    else {
      this.min = first.min ?? 0;
      this.max = first.max ?? 0;
    }
  }
}