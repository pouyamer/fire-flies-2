import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { ChangingValueConfig, ChangingValueKey, FireflyAppApiGetter, PossibleValue, ValueGeneratorParameters } from "../types";
import { getNumericValue, isRange } from "../utilities";

export class ChangingValueService
  implements Service {

  private fireflies: Firefly[];
  name;

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly key: ChangingValueKey<Firefly>,
    private readonly config: ChangingValueConfig,
    name: ServiceName,
    private readonly sideEffect?: (parameters: ValueGeneratorParameters & {
    current: number;
}) => void
  ) {
    this.name = name;
    this.fireflies = [...appApi('fireflies')];
  }

  public addFireflies(fireflies: Firefly[]): void {
    const fireflyKeys = this.fireflies.map(({key}) => key);

    for(const ff of fireflies) {
      if (!fireflyKeys.includes(ff.key)) fireflies.push(ff);
      this.setOnSingleFirefly(ff);
    }
  }

  public removeFireflies(fireflies: Firefly[]): void {
    const removingFireflyKeys = fireflies.map(({key}) => key);
    
    this.fireflies = this.fireflies.filter(({key}) => !removingFireflyKeys.includes(key));
  }

  // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
  private getValue(firefly: Firefly, value: PossibleValue<number>) {
    if (
      isRange(value) ||
      typeof value === "number" ||
      Array.isArray(value)
    ) {
      return getNumericValue(value);
    }
    else {
      return getNumericValue(value({
        firefly,
        ...this.appApi()
      }));
    }
  }

  public setOnSingleFirefly(firefly: Firefly) {  
    firefly[this.key].resetIteration();
      
    firefly[this.key].set(this.getValue(
      firefly,
      this.config.value
    ));

    firefly[this.key].max = (
      this.config.max !== null && 
      this.config.max !== undefined
    ) ? this.getValue(firefly, this.config.max) : null;

    firefly[this.key].min = (
      this.config.min !== null && 
      this.config.min !== undefined
    ) ? this.getValue(firefly, this.config.min) : null;

    firefly[this.key].nextValueFn = this.config.nextValueFn;

  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const fireflyProp = firefly[this.key];

    const parameters = {
      firefly,
      ...this.appApi(),
      current: fireflyProp.value,
      iteration: fireflyProp.iteration
    }
      
    if (fireflyProp.nextValueFn) {
      const nextValue = fireflyProp.nextValueFn(parameters)

      if (
        fireflyProp.max !== null &&
        nextValue >= fireflyProp.max
      ) {
        fireflyProp.set(fireflyProp.max);
        this.config.onMax?.(parameters)
      } else if (
        fireflyProp.min !== null &&
        nextValue <= fireflyProp.min
      ) {
        fireflyProp.set(fireflyProp.min);
        this.config.onMin?.(parameters);
      }
      else {
        fireflyProp.set(nextValue);
      }

      this.sideEffect?.(parameters)
      firefly[this.key].iterate();
    }
  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }
}