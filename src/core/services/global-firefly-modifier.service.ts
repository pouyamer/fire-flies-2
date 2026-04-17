import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, GlobalFireflyModifierConfig } from "../types";

export class GlobalFireflyModifierService implements Mutator, Ownable {
  
  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'globalFireflyModifier';

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
    this.config.updateOne?.({
      firefly: firefly,
      api: this.appApi
    })
  }

  setOne(firefly: Firefly): void {
      this.config.setOne?.({
        firefly: firefly,
        api: this.appApi
      })
  }

  update(): void {
    for(const ff of this.fireflies) {
      this.updateOne(ff);
    }
  }

  set(): void {
    for(const ff of this.fireflies) {
      this.setOne(ff);
    }
  }
}