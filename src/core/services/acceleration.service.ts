import { AccelerationType } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { AccelerationConfig } from "../types";
import { Utilities } from "../utilities";

export class AccelerationService
  implements Service {
  private config: AccelerationConfig;


  constructor(
    config: AccelerationConfig,
  ) {
    this.config = config
  }

  private getAccelerations(config: AccelerationConfig, firefly: Firefly): [number, number] {
    switch (config.type) {
      case AccelerationType.Cartesian:
        return [
          Utilities.getValue(config.accX),
          Utilities.getValue(config.accY),
        ]
      case AccelerationType.CartesianInDirection:
        return [
          Utilities.getSign(firefly.speedX) * Math.abs(Utilities.getValue(config.accX)),
          Utilities.getSign(firefly.speedY) * Math.abs(Utilities.getValue(config.accY))
        ]

      case AccelerationType.Polar:
        const angle = Utilities.getValue(config.angle_PI);
        const acc = Utilities.getValue(config.acc)
        return [
          Math.cos(angle) * acc,
          Math.sin(angle) * acc,
        ]

      case AccelerationType.PolarInDirection:
        return [
          Math.cos(firefly.movingAngle) * Utilities.getValue(config.acc),
          Math.sin(firefly.movingAngle) * Utilities.getValue(config.acc),
        ]

    }
  }

  public set(firefly: Firefly): void {
    const [accelerationX, accelerationY] = this.getAccelerations(this.config, firefly)
    firefly.accelerationX = accelerationX;
    firefly.accelerationY = accelerationY;
  }

  public execute(firefly: Firefly): void {
    firefly.speedX += firefly.accelerationX;
    firefly.speedY += firefly.accelerationY;
  };
}