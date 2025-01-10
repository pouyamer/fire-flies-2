import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, JitterConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class JitterService implements Service {
  name = ServiceName.Jitter;


  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: JitterConfig,
    private readonly app: FireflyApp
  ) {
  }

  // the inner get value sets args for Utilities.getValue in valueGenerator mode
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

    const {jitterX, jitterY} = this.config

    firefly.jitterX = this.getValue(firefly, jitterX)
    firefly.jitterY = this.getValue(firefly, jitterY)
    
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    firefly.x += firefly.jitterX * 2 * Math.random() - firefly.jitterX
    firefly.y += firefly.jitterY * 2 * Math.random() - firefly.jitterY
  }

  public setOnEveryFirefly(): void {
    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }


}