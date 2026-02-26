import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { PossibleValue, RotationConfig } from "../types";
import { Utilities } from "../utilities";

export class RotationService
  implements Service {
  
  private fireflies: Firefly[];
  name = ServiceName.Rotation;

  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: RotationConfig,
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
  private getValue(firefly: Firefly, value: PossibleValue<number>): number {
    if (
      Utilities.isRange(value) ||
      typeof value === "number" ||
      Array.isArray(value)
    ) {
      return Utilities.getNumericValue(value);
    }
    else {
      return Utilities.getNumericValue(value({
        firefly: firefly,
        canvas: this.canvas,
        fireflies: this.fireflies,
        app: this.app
      }));
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    firefly.rotatedAngle = this.getValue(firefly, this.config.startingAngle);
    firefly.rotateSpeed = this.getValue(firefly, this.config.speed_PI);
    firefly.rotateAcceleration = this.getValue(firefly, this.config.acceleration_PI);
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    firefly.rotatedAngle += firefly.rotateSpeed;
    firefly.rotateSpeed += firefly.rotateAcceleration;
  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  public onFramePass(): void {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }
}