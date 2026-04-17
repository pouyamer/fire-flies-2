import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, ShapeConfig, ShapeValue, ValueGeneratorWithFirefly, WeightedValue } from "../types";
import { chooseBetweenMultipleValues, getValueFromWeightedValues, isWeightedValues } from "../utilities";

export class ShapeService
  implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'shape';

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: ShapeConfig,
  ) { 
  }

    // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
  private getValue(firefly: Firefly, value: ShapeValue | ShapeValue[] | ValueGeneratorWithFirefly<ShapeValue | ShapeValue[]> | WeightedValue<ShapeValue>[]): ShapeValue {
    const rawValue = typeof value === 'function' 
      ? value({
        firefly: firefly,
        api: this.appApi
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
  
  add(firefly: Firefly): void {
    if(!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if(this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }

  public setOne(firefly: Firefly) {
    const fireFlyShapeValue = this.getValue(firefly, this.config.value);

    firefly.shapeValue = fireFlyShapeValue;

  }

  public set(): void {
    for (let ff of this.fireflies) {
      this.setOne(ff);
    }
  }

  updateOne(firefly: Firefly): void {
    // if(firefly.serviceToggle.get('shape')) {}
  }
  
  update() { 
    
  }
}