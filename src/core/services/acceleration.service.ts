import { AccelerationType, ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { AccelerationConfig } from "../types";
import { Utilities } from "../utilities";

export class AccelerationService
  implements Service {

  name = ServiceName.Acceleration;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: AccelerationConfig,
  ) {
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

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    const [accelerationX, accelerationY] = this.getAccelerations(this.config, firefly)
    firefly.accelerationX = accelerationX;
    firefly.accelerationY = accelerationY;
  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      ff.speedX += ff.accelerationX;
      ff.speedY += ff.accelerationY;
    }
  };
}