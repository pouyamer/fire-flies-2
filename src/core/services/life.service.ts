import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, LifeConfig, PossibleValue } from "../types";
import { getNumericValue, isRange } from "../utilities";

export class LifeService
  implements Mutator, Ownable {
  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'life';

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: LifeConfig,
  ) {
  }

  // the inner get value sets args for Utilities.getValue in valueGenerator mode
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
        firefly: firefly,
        api: this.appApi,
      }));
    }
  }

  add(firefly: Firefly): void {
    if (!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if (this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }

  setOne(firefly: Firefly): void {
    firefly.life = this.getValue(firefly, this.config.value);
    firefly.key = this.config.codeGenerator();
  }

  set(): void {
    for (let ff of this.fireflies) {
      this.setOne(ff);
    }
  }

  update(): void {
    for (let ff of this.fireflies) {
      this.updateOne(ff);
    }
  }

  updateOne(firefly: Firefly): void {

    if (this.config.nextValueFn) {
      const nextValue = this.config.nextValueFn({
        api: this.appApi,
        firefly: firefly,
      })

      if (nextValue <= 0) {
        this.config.onFireflyDead?.({

          api: this.appApi,
          firefly: firefly,
        });
        // this.appApi('app').removeFirefly(firefly)
      }

      firefly.life = nextValue
    }
  }


}