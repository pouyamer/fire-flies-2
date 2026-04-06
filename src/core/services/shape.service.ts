import { Service } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, ShapeConfig, ShapeValue, ValueGenerator, WeightedValue } from "../types";
import { chooseBetweenMultipleValues, getValueFromWeightedValues, isWeightedValues } from "../utilities";

export class ShapeService
  implements Service {

  private fireflies: Firefly[] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: ShapeConfig,
  ) { 
  }

    // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
  private getValue(firefly: Firefly, value: ShapeValue | ShapeValue[] | ValueGenerator<ShapeValue | ShapeValue[]> | WeightedValue<ShapeValue>[]): ShapeValue {
    const rawValue = typeof value === 'function' 
      ? value({
        firefly: firefly,
        ...this.appApi(),
      })
      : value

      if (Array.isArray(rawValue)) {
        if (isWeightedValues<ShapeValue>(rawValue)) {
          return getValueFromWeightedValues<ShapeValue>(rawValue)
        }
        else {
          return chooseBetweenMultipleValues(rawValue);
        }
      }
      else {
        return rawValue;
      }

  }

  addFirefly(firefly: Firefly): void {
    this.fireflies.push(firefly);
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
    if(firefly.serviceToggle.get('shape')) {}
  }
  
  onFramePass() { 
    
  }
}