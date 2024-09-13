import { SpeedType } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { SpeedConfig } from "../types";
import { Utilities } from "../utilities";

export class SpeedService
  implements Service {
  fireflies: Firefly[];
  private config: SpeedConfig;

  constructor(
    fireflies: Firefly[],
    config: SpeedConfig,
  ) {
    this.fireflies = fireflies;
    this.config = config;
    this.initializeFireflies();
  }

  private initializeFireflies(): void {
    this.fireflies.forEach(
      firefly => {
        const speedsAndAngle = this.getSpeedsAndAngle(this.config);
        firefly.speedX = speedsAndAngle.speeds[0];
        firefly.speedY = speedsAndAngle.speeds[1];
        // see movingAngle in firefly model
        firefly.movingAngle = speedsAndAngle.angle ?? 0;
      }
    )
  }

  private getSpeedsAndAngle(config: SpeedConfig): {
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

    }
  }

  public execute = (): void => {
    this.fireflies.forEach(
      firefly => {
        firefly.x += firefly.speedX;
        firefly.y += firefly.speedY;
      }
    )
  };
}