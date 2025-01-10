import { FireflyApp } from "../app";
import { ServiceName, Shape, ShapeSetMethod } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { PossibleValue, ShapeConfig, ShapeValue } from "../types";
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
    private getValue(firefly: Firefly, value: PossibleValue<number>): number {
      if (Utilities.isRange(value)) {
        return Utilities.getNumericValue(value, true);
      }
      else if (
        typeof value == "number" ||
        Array.isArray(value)
      ) {
        return Utilities.getNumericValue(value)
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
    
    switch (this.config.setMethod) {
      case ShapeSetMethod.SingleShape:
        firefly.shape = this.config.value;
        if (this.config.value === Shape.RegularPolygon)
          firefly.sideCount = this.getValue(
            firefly,
            this.config.sideCount
          );

        if (this.config.value === Shape.RegularPolygram)
          firefly.pointCount = this.getValue(
            firefly,
            this.config.pointCount
          );

        break;
        
      case ShapeSetMethod.Random:
        const shapeValue = Utilities.chooseBetweenMultipleValues<ShapeValue>(this.config.values);
        firefly.shape = shapeValue.value

        if (shapeValue.value === Shape.RegularPolygon)
          firefly.sideCount = this.getValue(
            firefly,
            shapeValue.sideCount
          );
        else if (shapeValue.value === Shape.RegularPolygram)
          firefly.pointCount = this.getValue(
            firefly,
            shapeValue.pointCount
          );

        break;
      case ShapeSetMethod.ShapeSetterCallback:
        break;
    }
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