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