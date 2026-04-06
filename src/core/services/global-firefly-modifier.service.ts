import { Service } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, GlobalFireflyModifierConfig } from "../types";

export class GlobalFireflyModifierService implements Service {
  
  private fireflies: Firefly[] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: GlobalFireflyModifierConfig,
  ){
  }

  addFirefly(firefly: Firefly): void {
    this.fireflies.push(firefly);
  }
  
  onFramePassForSingleFirefly(firefly: Firefly): void {
    this.config.onFramePassModifier({
      firefly: firefly,
      api: this.appApi
    })
  }

  setOnSingleFirefly(firefly: Firefly): void {
    if (this.config.onSetModifier) {
      this.config.onSetModifier({
        firefly: firefly,
        api: this.appApi
      })
    }
  }

  onFramePass(): void {
    for(const ff of this.fireflies) {
      ff.serviceToggle.get('globalFireflyModifier') && this.onFramePassForSingleFirefly(ff);
    }
  }

  setOnEveryFirefly(): void {
    for(const ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }
}