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
  private speedPolarAngle: boolean = false;
  private speedPolarAmount: boolean = false;
  private window: boolean = false;

  constructor() { }

  public toggle(key: Key, toggle: boolean): void
  public toggle(key: Key, toggle: (value: boolean) => boolean): void
  public toggle(key: Key, toggle: boolean | ((value: boolean) => boolean)): void {
    if (typeof toggle === 'boolean') {
      this[key] = toggle;
    }
    else {
      this[key] = toggle(this[key]);
    }
  }

  public halt(...keys: Key[]): void {
    keys.forEach(key => {
      this[key] = false;
    })
  }

  public proceed(...keys: Key[]): void {
    keys.forEach(key => {
      this[key] = true;
    })
  }

  public get(key: Key): boolean {
    return this[key]
  }
}


type Key= 
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
  | "speedPolarAngle"
  | "speedPolarAmount"
  | "window"