import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { FireflyAppApi, LifeConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class LifeService 
  implements Service {
    name = ServiceName.Life;
    private fireflies: Firefly[];

    constructor(
      private readonly appApi: FireflyAppApi,
      private readonly config: LifeConfig,
    ) {
      this.fireflies = [...appApi.fireflies];
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

    // the inner get value sets args for Utilities.getValue in valueGenerator mode
    private getValue(firefly: Firefly, value: PossibleValue<number>) {
      if (
        Utilities.isRange(value) ||
        typeof value === "number" ||
        Array.isArray(value)
      ) {
        return Utilities.getNumericValue(value);
      }
      else {
        return Utilities.getNumericValue(value({
          firefly: firefly,
          ...this.appApi,
        }));
      }
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
        this.onFramePassForSingleFirefly(ff);
      }
    }

   onFramePassForSingleFirefly(firefly: Firefly): void {
    
      if (this.config.nextValueFn) {
        const nextValue = this.config.nextValueFn({
          ...this.appApi,
          firefly: firefly,
        })

        if (nextValue <= 0) {
          this.config.onFireflyDead?.({
            ...this.appApi,
            firefly: firefly,
          });
          this.appApi.app.removeFirefly(firefly)
        }

        firefly.life = nextValue
      }
    }


  }