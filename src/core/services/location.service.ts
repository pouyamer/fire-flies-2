import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, LocationConfig, PossibleValue } from "../types";
import { getNumericValue, isRange, polarToCartesian } from "../utilities";

export class LocationService
  implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'shape';

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: LocationConfig,
  ) { 
    this.fireflies = [...appApi('fireflies')];
  }

  private getValue(firefly: Firefly, value: PossibleValue<number>) {
    if (
      isRange(value) ||
      typeof value === "number" ||
      Array.isArray(value)
    ) {
      return getNumericValue(value);
    }
    else {
      return getNumericValue(value({
        firefly,
        api: this.appApi
      }));
    }
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

  public setOne(firefly: Firefly) {
    const {x, y} = this.config;

    firefly.x = this.getValue(firefly, x);
    firefly.y = this.getValue(firefly, y);
  }

  public updateOne(firefly: Firefly): void {
    const cartesianFromPolarSpeedValue = polarToCartesian(
      firefly.polarSpeedAmount.value,
      firefly.polarSpeedAngle.value,
    )

    const cartesianFromPolarJitterValue = polarToCartesian(
      firefly.jitterPolarAmount.value,
      firefly.jitterPolarAngle.value,
    );
    
    firefly.x += (firefly.jitterX.value * 2 * Math.random()) - firefly.jitterX.value
    firefly.y += (firefly.jitterY.value * 2 * Math.random()) - firefly.jitterY.value;
    firefly.x += (cartesianFromPolarJitterValue.x * 2 * Math.random()) - cartesianFromPolarJitterValue.x
    firefly.y += (cartesianFromPolarJitterValue.y * 2 * Math.random()) - cartesianFromPolarJitterValue.y

      firefly.x += firefly.speedX.value + cartesianFromPolarSpeedValue.x;
    firefly.y += firefly.speedY.value + cartesianFromPolarSpeedValue.y;
  }

  public set(): void {
    for(let ff of this.fireflies) {
      this.setOne(ff)
    }
  }
  
  public update() {
    for(let ff of this.fireflies) {
      this.updateOne(ff)
    }
  }
}