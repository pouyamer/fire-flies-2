import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { LocationConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class LocationService
  implements Service {

  name = ServiceName.Location;
  private fireflies: Firefly[];

  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: LocationConfig,
    private readonly app: FireflyApp
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
    const {x, y} = this.config;

    firefly.x = this.getValue(firefly, x);
    firefly.y = this.getValue(firefly, y);
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const cartesianFromPolarSpeedValue = Utilities.Speed.toCartesian(
      firefly.polarSpeedAmount.value,
      firefly.polarSpeedAngle.value,
    )
    firefly.x += firefly.speedX.value + cartesianFromPolarSpeedValue.speedX;
    firefly.y += firefly.speedY.value + cartesianFromPolarSpeedValue.speedY;
  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }
  
  public onFramePass() {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }
}