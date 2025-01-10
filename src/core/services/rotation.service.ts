import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, PossibleValue, RotationConfig } from "../types";
import { Utilities } from "../utilities";

export class RotationService
  implements Service {
  
  name = ServiceName.Rotation;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: RotationConfig,
    private readonly app: FireflyApp
  ) {}

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
        currentFirefly: firefly,
        canvas: this.canvas,
        fireflies: this.fireflies,
        app: this.app
      }));
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }

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