import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKey, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { ChangingValueConfig, ChangingValueKey, FireflyAppApiGetter, PossibleValue, ValueGeneratorParameters } from "../types";
import { getNumericValue, isRange } from "../utilities";

export class ChangingValueService
  implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly;

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly cvKey: ChangingValueKey<Firefly>,
    private readonly config: ChangingValueConfig,
    public readonly serviceToggleKey: FireflyServiceToggleKey,
    private readonly sideEffect?: (parameters: ValueGeneratorParameters & {
      current: number;
    }) => void
  ) {
    this.key = serviceToggleKey;
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
        api: this.appApi
      }));
    }
  }

  add(firefly: Firefly): void {
    this.fireflies.push(firefly);
  }

  remove(firefly: Firefly): void {
    if (this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }

  public setOne(firefly: Firefly) {
    firefly[this.cvKey].resetIteration();

    firefly[this.cvKey].set(this.getValue(
      firefly,
      this.config.value
    ));

    firefly[this.cvKey].max = (
      this.config.max !== null &&
      this.config.max !== undefined
    ) ? this.getValue(firefly, this.config.max) : null;

    firefly[this.cvKey].min = (
      this.config.min !== null &&
      this.config.min !== undefined
    ) ? this.getValue(firefly, this.config.min) : null;

    firefly[this.cvKey].nextValueFn = this.config.nextValueFn;

  }

  public set(): void {
    for (let ff of this.fireflies) {
      this.setOne(ff)
    }
  }

  public updateOne(firefly: Firefly): void {
    const fireflyProp = firefly[this.cvKey];

    const parameters = {
      firefly,
      api: this.appApi,
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
      firefly[this.cvKey].iterate();
    }
  }

  public update(): void {
    for (let ff of this.fireflies) {
      this.updateOne(ff)
    }
  }
}