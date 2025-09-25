import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { ShapeConfig, ShapeValue, ValueGenerator, WeightedValue } from "../types";
import { Utilities } from "../utilities";

export class ShapeService
  implements Service {

  private fireflies: Firefly[];
  name = ServiceName.Shape;

  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: ShapeConfig,
    private readonly app: FireflyApp,
  ) { 
    this.fireflies = [...fireflies];
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