export class FireflyServiceToggle {
  private bounds: boolean = false;
  private collision: boolean = false;
  private draw: boolean = false;
  private globalFireflyModifier: boolean = false;
  private jitterX: boolean = false;
  private jitterY: boolean = false;
  private jitterPolarAngle: boolean = false;
  private jitterPolarAmount: boolean = false;
  private life: boolean = false;
  private location: boolean = false
  private neighbourhood: boolean = false;
  private red: boolean = false;
  private green: boolean = false;
  private blue: boolean = false;
  private alpha: boolean = false;
  private hue: boolean = false;
  private saturation: boolean = false;
  private lightness: boolean = false;
  private rotation: boolean = false;
  private shape: boolean = false;
  private size: boolean = false;
  private speedX: boolean = false;
  private speedY: boolean = false;
  private polarSpeedAngle: boolean = false;
  private polarSpeedAmount: boolean = false;
  private window: boolean = false;

  constructor() { }

  public toggle(key: FireflyServiceToggleKey, toggle: boolean): void
  public toggle(key: FireflyServiceToggleKey, toggle: (value: boolean) => boolean): void
  public toggle(key: FireflyServiceToggleKey, toggle: boolean | ((value: boolean) => boolean)): void {
    if (typeof toggle === 'boolean') {
      this[key] = toggle;
    }
    else {
      this[key] = toggle(this[key]);
    }
  }

  public halt(...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
      this[key] = false;
    })
  }

  public activate(...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
      this[key] = true;
    })
  }

  public get(key: FireflyServiceToggleKey): boolean {
    return this[key]
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

export type FireflyServiceToggleKeyRequiringFirefly = Omit<FireflyServiceToggleKey, FireflyServiceToggleKeyNotRequiringFirefly>[]