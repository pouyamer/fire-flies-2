import { ServiceName, Shape, ShapeSetMethod } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { ShapeConfig, ShapeValue } from "../types";
import { Utilities } from "../utilities";

export class ShapeService
  implements Service {

  name = ServiceName.Shape;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: ShapeConfig,
  ) { }

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    switch (this.config.setMethod) {
      case ShapeSetMethod.SingleShape:
        firefly.shape = this.config.value;
        if (this.config.value === Shape.RegularPolygon)
          firefly.sideCount = Utilities.getValue(this.config.sideCount, true)
        if (this.config.value === Shape.RegularPolygram)
          firefly.pointCount = Utilities.getValue(this.config.pointCount, true)
        break;
      case ShapeSetMethod.Random:
        const shapeValue = Utilities.chooseBetweenMultipleValues<ShapeValue>(this.config.values);
        firefly.shape = shapeValue.value

        if (shapeValue.value === Shape.RegularPolygon)
          firefly.sideCount = Utilities.getValue(shapeValue.sideCount, true)
        else if (shapeValue.value === Shape.RegularPolygram)
          firefly.pointCount = Utilities.getValue(shapeValue.pointCount, true)

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