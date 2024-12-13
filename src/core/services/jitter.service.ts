import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, JitterConfig } from "../types";
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

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    firefly.jitterX = Utilities.getValue(this.config.jitterX);
    firefly.jitterY = Utilities.getValue(this.config.jitterY)
    
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