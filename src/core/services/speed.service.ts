import { ServiceName, SpeedType } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export class SpeedService
  implements Service {

  name = ServiceName.Speed;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: SpeedConfig,
  ) {
  }

  private getSpeedsAndAngle(
    config: SpeedConfig,
    firefly: Firefly,
  ): {
    speeds: [number, number],
    angle?: number,
  } {

    switch (config.type) {
      case SpeedType.Cartesian:
        return {
          speeds: [
            Utilities.getValue(config.speedX),
            Utilities.getValue(config.speedY)
          ]
        }
      case SpeedType.Polar:
        const angle = Utilities.getValue(config.angle_PI);
        const speed = Utilities.getValue(config.speed);

        return {
          speeds: [
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
          ],
          angle
        }

      case SpeedType.ChangerCallback:
        return {
          speeds: [
            config.changerX(firefly),
            config.changerY(firefly),
          ]
        }
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    const speedsAndAngle = this.getSpeedsAndAngle(
      this.config,
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

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      ff.x += ff.speedX;
      ff.y += ff.speedY;
    }
  };
}