import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { JitterConfig, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class JitterService implements Service {

  private fireflies: Firefly[];
  name = ServiceName.Jitter;

  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: JitterConfig,
    private readonly app: FireflyApp
  ) {
    this.fireflies = [...fireflies];
  }

  public addFireflies(fireflies: Firefly[]): void {
    const fireflyKeys = this.fireflies.map(({key}) => key);

    for(const ff of fireflies) {
      if (!fireflyKeys.includes(ff.key)) fireflies.push(ff);
      this.setOnSingleFirefly(ff);
    }
  }

  public removeFireflies(fireflies: Firefly[]): void {
    const removingFireflyKeys = fireflies.map(({key}) => key);
    
    this.fireflies = this.fireflies.filter(({key}) => !removingFireflyKeys.includes(key));
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