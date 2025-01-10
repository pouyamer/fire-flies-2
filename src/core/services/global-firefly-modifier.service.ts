import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { GlobalFireflyModifierConfig } from "../types";

export class GlobalFireflyModifierService implements Service {
  name = ServiceName.GlobalFireflyModifier;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: GlobalFireflyModifierConfig,
    private readonly app: FireflyApp
  ){}

  onFramePassForSingleFirefly(firefly: Firefly): void {
    this.config.onFramePassModifier({
      currentFirefly: firefly,
      canvas: this.canvas,
      fireflies: this.fireflies,
      app: this.app
    })
  }

  setOnSingleFirefly(firefly: Firefly): void {

  }

  onFramePass(): void {
    for(const ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }

  setOnEveryFirefly(): void {
    
  }
}