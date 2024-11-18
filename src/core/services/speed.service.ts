import { SpeedType } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export class SpeedService
  implements Service {

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

  public set(firefly: Firefly): void {
    const speedsAndAngle = this.getSpeedsAndAngle(
      this.config,
      firefly
    );
    firefly.speedX = speedsAndAngle.speeds[0];
    firefly.speedY = speedsAndAngle.speeds[1];
    // see movingAngle in firefly model
    firefly.movingAngle = speedsAndAngle.angle ?? 0;
  }

  public execute(firefly: Firefly): void {
    firefly.x += firefly.speedX;
    firefly.y += firefly.speedY;
  };
}