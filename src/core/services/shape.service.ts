import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { ShapeConfig, ShapeValue, ValueGenerator, WeightedValue } from "../types";
import { Utilities } from "../utilities";

export class ShapeService
  implements Service {

  name = ServiceName.Shape;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: ShapeConfig,
    private readonly app: FireflyApp,
  ) { }

    // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
  private getValue(firefly: Firefly, value: ShapeValue | ShapeValue[] | ValueGenerator<ShapeValue | ShapeValue[]> | WeightedValue<ShapeValue>[]): ShapeValue {
    const rawValue = typeof value === 'function' 
      ? value({
        app: this.app,
        canvas: this.canvas,
        currentFirefly: firefly,
        fireflies: this.fireflies
      })
      : value

      if (Array.isArray(rawValue)) {
        if (Utilities.isWeightedValues<ShapeValue>(rawValue)) {
          return Utilities.getValueFromWeightedValues<ShapeValue>(rawValue)
        }
        else {
          return Utilities.chooseBetweenMultipleValues(rawValue);
        }
      }
      else {
        return rawValue;
      }

  }

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }

    const fireFlyShapeValue = this.getValue(firefly, this.config.value);

    firefly.shapeValue = fireFlyShapeValue;

  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  onFramePassForSingleFirefly(firefly: Firefly): void {
    
  }
  
  onFramePass() { }
}