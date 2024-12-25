import { FireflyApp } from "../app";
import { ServiceName, SpeedType } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { PossibleValue, SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export class SpeedService
  implements Service {

  name = ServiceName.Speed;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: SpeedConfig,
    private readonly app: FireflyApp
  ) {
  }

  // the inner get value sets args for Utilities.getValue in valueGenerator mode
  private getValue(firefly: Firefly, value: PossibleValue): number {
    if (
      Utilities.isRange(value) ||
      typeof value === "number" ||
      Array.isArray(value)
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

  private getSpeedsAndAngle(
    firefly: Firefly,
  ): {
    speeds: [number, number],
    angle?: number,
  } {

    switch (this.config.type) {
      case SpeedType.Cartesian:
        return {
          speeds: [
            this.getValue(firefly, this.config.speedX),
            this.getValue(firefly, this.config.speedY)
          ]
        }
      case SpeedType.Polar:
        const angle = this.getValue(firefly, this.config.angle_PI);
        const speed = this.getValue(firefly, this.config.speed);

        return {
          speeds: [
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
          ],
          angle
        }
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    const speedsAndAngle = this.getSpeedsAndAngle(
      firefly
    );
    firefly.speedX = speedsAndAngle.speeds[0];
    firefly.speedY = speedsAndAngle.speeds[1];
    // see movingAngle in firefly model
    firefly.movingAngle = speedsAndAngle.angle ?? 0;
  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const serviceExists: boolean = !!firefly.activeServices.find(
      s => s.name === this.name
    )

    if (serviceExists) {
      firefly.x += firefly.speedX;
      firefly.y += firefly.speedY
    }

  }


  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  };
}