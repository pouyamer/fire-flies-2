import { ALL_SERVICE_KEYS } from "../constants";

export class FireflyServiceToggle {
  private readonly map = new Map<FireflyServiceToggleKey, boolean>();

  constructor() { 
    ALL_SERVICE_KEYS.forEach(key => this.map.set(key, true));
  }

  public toggle(key: FireflyServiceToggleKey, toggle: boolean): void
  public toggle(key: FireflyServiceToggleKey, toggle: (value: boolean) => boolean): void
  public toggle(key: FireflyServiceToggleKey, toggle: boolean | ((value: boolean) => boolean)): void {
    if (typeof toggle === 'boolean') {
      this.map.set(key, toggle);
    }
    else {
      const currentValue = this.map.get(key)

      if (currentValue !== undefined) {
        this.map.set(key, toggle(currentValue));
      }
    }
  }

  public halt(...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
      this.map.set(key, false);
    })
  }

  public activate(...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
      this.map.set(key, true);
    })
  }

  public get(key: FireflyServiceToggleKey): boolean {
    const value = this.map.get(key)

    if (value === undefined) throw new Error();
    return value;
  }
}


export type FireflyServiceToggleKey = 
  | "bounds"
  | "collision"
  | "draw"
  | "globalFireflyModifier"
  | "jitterX"
  | "jitterY"
  | "jitterPolarAngle"
  | "jitterPolarAmount"
  | "life"
  | "location"
  | "neighbourhood"
  | "red"
  | "green"
  | "blue"
  | "alpha"
  | "hue"
  | "saturation"
  | "lightness"
  | "rotation"
  | "shape"
  | "size"
  | "speedX"
  | "speedY"
  | "polarSpeedAngle"
  | "polarSpeedAmount"
  | "window"

export type FireflyServiceToggleKeyNotRequiringFirefly = Extract<FireflyServiceToggleKey, 'window' | 'bounds' | 'neighbourhood'>

export type FireflyServiceToggleKeyRequiringFirefly = Omit<FireflyServiceToggleKey, FireflyServiceToggleKeyNotRequiringFirefly>