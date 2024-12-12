import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, RotationConfig } from "../types";
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

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }

    firefly.rotatedAngle = Utilities.getValue(this.config.startingAngle,);
    firefly.rotateSpeed = Utilities.getValue(this.config.speed_PI);
    firefly.rotateAcceleration = Utilities.getValue(this.config.acceleration_PI);
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