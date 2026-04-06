import { Service } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, LifeConfig, PossibleValue } from "../types";
import { getNumericValue, isRange } from "../utilities";

export class LifeService 
  implements Service {
    private fireflies: Firefly[] = [];

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

    addFirefly(firefly: Firefly): void {
      this.fireflies.push(firefly);
    }

    setOnSingleFirefly(firefly: Firefly): void {
      firefly.life = this.getValue(firefly, this.config.value);
      firefly.key = this.config.codeGenerator();
    }

    setOnEveryFirefly(): void {
      for (let ff of this.fireflies) {
        this.setOnSingleFirefly(ff);
      }
    }

    onFramePass(): void {
      for (let ff of this.fireflies) {
        ff.serviceToggle.get('life') && this.onFramePassForSingleFirefly(ff);
      }
    }

   onFramePassForSingleFirefly(firefly: Firefly): void {
    
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