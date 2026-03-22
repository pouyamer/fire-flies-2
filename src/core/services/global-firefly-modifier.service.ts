import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApi, GlobalFireflyModifierConfig } from "../types";

export class GlobalFireflyModifierService implements Service {
  
  private fireflies: Firefly[];
  name = ServiceName.GlobalFireflyModifier;

  constructor(
    private readonly appApi: FireflyAppApi,
    private readonly config: GlobalFireflyModifierConfig,
  ){
    this.fireflies = [...appApi.fireflies];
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

  onFramePassForSingleFirefly(firefly: Firefly): void {
    this.config.onFramePassModifier({
      firefly: firefly,
      ...this.appApi,
    })
  }

  setOnSingleFirefly(firefly: Firefly): void {
    if (this.config.onSetModifier) {
      this.config.onSetModifier({
        firefly: firefly,
      ...this.appApi,
      })
    }
  }

  onFramePass(): void {
    for(const ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }

  setOnEveryFirefly(): void {
    for(const ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }
}