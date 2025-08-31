import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { LifeConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class LifeService 
  implements Service {
    name = ServiceName.Life;

    constructor(
      private readonly canvas: FireflyCanvas,
      private readonly fireflies: Firefly[],
      private readonly config: LifeConfig,
      private readonly app: FireflyApp
    ) {}

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
          currentFirefly: firefly,
          canvas: this.canvas,
          fireflies: this.fireflies,
          app: this.app
        }));
      }
    }

    setOnSingleFirefly(firefly: Firefly): void {
      if (!firefly.activeServices?.some(service => service.name === this.name)) {
        firefly.activeServices?.push(this)
      }

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
    const serviceExists = !!firefly.activeServices.find(
      s => s.name === this.name
    );
    
    if (serviceExists) {
      if (this.config.nextValueFn) {
        const nextValue = this.config.nextValueFn({
          app: this.app,
          canvas: this.canvas,
          currentFirefly: firefly,
          fireflies: this.fireflies
        })

        if (nextValue <= 0) {
          this.config.onFireflyDead?.({
            app: this.app,
            canvas: this.canvas,
            currentFirefly: firefly,
            fireflies: this.fireflies
          })
          this.app.removeFirefly(firefly)
        }

        firefly.life = nextValue
      }
    }
   } 


  }