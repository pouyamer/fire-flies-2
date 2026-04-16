import { Mutator, Ownable } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, GlobalFireflyModifierConfig } from "../types";

export class GlobalFireflyModifierService implements Mutator, Ownable {
  
  private fireflies: Firefly[] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: GlobalFireflyModifierConfig,
  ){
  }

  add(firefly: Firefly): void {
    if(!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if(this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }
  
  updateOne(firefly: Firefly): void {
    this.config.onFramePassModifier({
      firefly: firefly,
      api: this.appApi
    })
  }

  setOne(firefly: Firefly): void {
    if (this.config.onSetModifier) {
      this.config.onSetModifier({
        firefly: firefly,
        api: this.appApi
      })
    }
  }

  update(): void {
    for(const ff of this.fireflies) {
      ff.serviceToggle.get('globalFireflyModifier') && this.updateOne(ff);
    }
  }

  set(): void {
    for(const ff of this.fireflies) {
      this.setOne(ff);
    }
  }
}