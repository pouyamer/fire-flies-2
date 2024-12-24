import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { LocationConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class LocationService
  implements Service {

  name = ServiceName.Location;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: LocationConfig,
    private readonly app: FireflyApp
  ) { }

    // the inner get value sets args for Utilities.getValue in valueGenerator mode
    private getValue(firefly: Firefly, value: PossibleValue) {
      if (
        Utilities.isRange(value) ||
        typeof value === "number"
      ) {
        return Utilities.getValue(value);
      }
      else {
        return Utilities.getValue(value(
          firefly,
          this.canvas,
          this.fireflies,
          this.app
        ));
      }
    }

    

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }

    const {x, y} = this.config;

    firefly.x = this.getValue(firefly, x);
    firefly.y = this.getValue(firefly, y);
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