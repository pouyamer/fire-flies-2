import { LocationSetMethod, ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { LocationConfig } from "../types";
import { Utilities } from "../utilities";

export class LocationService
  implements Service {

  name = ServiceName.Location;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: LocationConfig,
  ) { }

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    switch (this.config.type) {
      case LocationSetMethod.Set:
        firefly.x = Utilities.getValue(this.config.x)
        firefly.y = Utilities.getValue(this.config.y)
        break;
      case LocationSetMethod.Random:
        firefly.x = Utilities.getValue({
          min: 0,
          max: this.canvas.width,
        })

        firefly.y = Utilities.getValue({
          min: 0,
          max: this.canvas.height,
        })
        break;
      case LocationSetMethod.RandomX:
        firefly.x = Utilities.getValue({
          min: 0,
          max: this.canvas.width,
        })

        firefly.y = Utilities.getValue(this.config.y)
        break;
      case LocationSetMethod.RandomY:
        firefly.x = Utilities.getValue(this.config.x)

        firefly.y = Utilities.getValue({
          min: 0,
          max: this.canvas.height,
        })
        break;
      case LocationSetMethod.CenterOfCanvas:
        firefly.x = this.canvas.width / 2;
        firefly.y = this.canvas.height / 2;
        break;
      case LocationSetMethod.CenterX:
        firefly.x = this.canvas.width / 2;
        firefly.y = Utilities.getValue(this.config.y)
        break;
      case LocationSetMethod.CenterY:
        firefly.x = Utilities.getValue(this.config.x)
        firefly.y = this.canvas.height / 2;
        break;
      case LocationSetMethod.FromXToCanvasWidth:
        firefly.x = Utilities.getValue({
          min: this.config.x,
          max: this.canvas.width
        })
        firefly.y = Utilities.getValue(this.config.y)
        break;
      case LocationSetMethod.FromYToCanvasHeight:
        firefly.x = Utilities.getValue(this.config.x)

        firefly.y = Utilities.getValue({
          min: this.config.y,
          max: this.canvas.height
        })
        break;
      case LocationSetMethod.FromXandYToCanvasSize:
        firefly.x = Utilities.getValue({
          min: this.config.x,
          max: this.canvas.width
        })
        firefly.y = Utilities.getValue({
          min: this.config.y,
          max: this.canvas.height
        })
        break;
      case LocationSetMethod.CanvasRelativeCallback:
        const valueFromCallback = this.config.locationSetter(
          this.canvas.width,
          this.canvas.height
        )

        firefly.x = Utilities.getValue(valueFromCallback[0]);
        firefly.y = Utilities.getValue(valueFromCallback[1])
        break;
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    
  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }
  
  public onFramePass() { }
}