import { FireflyApp } from "../app";
import { AccelerationType, ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { AccelerationConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class AccelerationService
  implements Service  {

  name = ServiceName.Acceleration;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: AccelerationConfig,
    private readonly app: FireflyApp
  ) {
  }

  // the inner get value sets args for Utilities.getValue in valueGenerator mode
  private getValue(firefly: Firefly, value: PossibleValue) {
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

  private getAccelerations(firefly: Firefly): [number, number] {
    switch (this.config.type) {
      case AccelerationType.Cartesian:
        return [
          this.getValue(
            firefly,
            this.config.accX
          ),
          this.getValue(
            firefly,
            this.config.accY
          ),
        ]
      case AccelerationType.CartesianInDirection:
        return [
          Utilities.getSign(firefly.speedX) * Math.abs(this.getValue(
            firefly,
            this.config.accX
          )),
          Utilities.getSign(firefly.speedY) * Math.abs(this.getValue(
            firefly,
            this.config.accY
          ))
        ]

      case AccelerationType.Polar:
        const angle = this.getValue(
          firefly,
          this.config.angle_PI
        );
        const acc = this.getValue(
          firefly,
          this.config.acc
        )
        return [
          Math.cos(angle) * acc,
          Math.sin(angle) * acc,
        ]

      case AccelerationType.PolarInDirection:
        return [
          Math.cos(firefly.movingAngle) * this.getValue(
            firefly,
            this.config.acc
          ),
          Math.sin(firefly.movingAngle) * this.getValue(
            firefly,
            this.config.acc
          ),
        ]

    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    const [accelerationX, accelerationY] = this.getAccelerations(firefly)
    firefly.accelerationX = accelerationX;
    firefly.accelerationY = accelerationY;
  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === this.name
    );
    
    if (serviceExists) {
      firefly.speedX += firefly.accelerationX;
      firefly.speedY += firefly.accelerationY;
    }
  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  };
}