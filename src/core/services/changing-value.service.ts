import { FireflyApp } from "../app";
import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { Service } from "../interfaces";
import { ChangingNumericalValueItem, Firefly, FireflyCanvas } from "../models";
import { ChangingValueConfig, ChangingValueKey, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class ChangingValueService
  implements Service {

  name;

  constructor(
    private readonly key: ChangingValueKey<Firefly>,
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: ChangingValueConfig,
    name: ServiceName,
    private readonly app: FireflyApp,
  ) {
    this.name = name;
  }

    // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
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

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    firefly[this.key].value = this.getValue(
      firefly,
      this.config.value
    );

    firefly[this.key].max = this.config.max ? this.getValue(firefly, this.config.max) : null;
    firefly[this.key].min = this.config.min ? this.getValue(firefly, this.config.min) : null;
  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const fireflyProp = firefly[this.key];

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === this.name
    )

    if (serviceExists) {

      const parameters = {
          currentFirefly: firefly,
          canvas: this.canvas, 
          fireflies: this.fireflies,
          app: this.app
        }
      
      const nextValue = this.config.nextValueFn ? this.config.nextValueFn(parameters) : fireflyProp.value;

      if (
        fireflyProp.max !== null &&
        nextValue > fireflyProp.max
      ) {
        this.config.onMax?.(parameters)
        fireflyProp.value = fireflyProp.max;
      } else if (
        fireflyProp.min !== null &&
        nextValue < fireflyProp.min
      ) {
        this.config.onMin?.(parameters);
        fireflyProp.value = fireflyProp.min;
      }
      else {
        fireflyProp.value = nextValue;
      }

    }



  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }
}