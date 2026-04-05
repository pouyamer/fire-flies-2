import { FIREFLY_SERVICE_DEFAULT_CONFIGS } from "./constants";
import { ServiceName } from "./enums";
import { Firefly, FireflyCanvas } from "./models";
import { BoundService, ChangingValueService, DrawService, GlobalFireflyModifierService, LifeService, LocationService, NeighbourhoodService, ShapeService, WindowService } from "./services";
import { ColorBinderService } from "./services/color-binder.service";
import { Arc, FireflyAppApi, FireflyAppApiGetter, FireflyServiceConfigs, GeneralFireflyConfig, HslColorConfig, Line, RgbColorConfig, ServiceType } from "./types";
import { deepMerge } from "./utilities";

export class FireflyApp {

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private configs: FireflyServiceConfigs = FIREFLY_SERVICE_DEFAULT_CONFIGS;
  private lines: Line[] = [];
  private arcs: Arc[] = [];
  private services: ServiceType[] = [];



  private paused: boolean = false;

  private _api(): FireflyAppApi;
  private _api(query: 'fireflies'): Firefly[];
  private _api(query: 'canvas'): FireflyCanvas;
  private _api(query: 'app'): FireflyApp;
  private _api(query: 'lines'): Line[];
  private _api(query: 'arcs'): Arc[];
  private _api(query?: keyof FireflyAppApi): FireflyAppApi[keyof FireflyAppApi] | FireflyAppApi  {

    if (!query) {
      return {
        fireflies: this.fireflies,
        canvas: this.canvas,
        app: this,
        lines: this.lines,
        arcs: this.arcs
      }
    }
    switch (query) {
      case "fireflies":
        return this.fireflies;
      case "canvas":
        return this.canvas;
      case "app":
        return this;
      case "lines":
        return this.lines;
      case "arcs":
        return this.arcs
    }
  }

  private api: FireflyAppApiGetter = this._api.bind(this)


  constructor(
    canvas: FireflyCanvas,
    private readonly windowContext: Window & typeof globalThis,
    configs: Partial<FireflyServiceConfigs> = FIREFLY_SERVICE_DEFAULT_CONFIGS
  ) {

    this.canvas = canvas;
    this.configs = deepMerge(FIREFLY_SERVICE_DEFAULT_CONFIGS, configs);
    this.createFireflies();

    // services will execute here
    this.buildServices();
    this.setServices();
  }


  public get generalConfig(): GeneralFireflyConfig {
    return this.configs.generalFirefly;
  }

  public get colorConfigInfo(): { type: 'HSL', config: HslColorConfig } | { type: 'RGB', config: RgbColorConfig } {
    return this.configs.generalFirefly.colorMode === 'HSL'
      ? {
        type: 'HSL', config: this.configs.hslColor
      }
      : {
        type: 'RGB', config: this.configs.rgbColor,
      }
  }

  public disposeLine(line: Line): void {
    this.lines =  this.lines.filter(l => line !== l)
  }

  public addLine(line: Line): void {
    this.lines.push(line)
  }

  public disposeArc(arc: Arc): void {
    this.arcs =  this.arcs.filter(a => arc !== a)
  }

  public addArc(arc: Arc): void {
    this.arcs.push(arc)
  }

  public getConfig(key: keyof FireflyServiceConfigs) {
    return this.configs[key];
  }


  private createFireflies(): void {
    this.fireflies = Array.from({ length: this.configs.generalFirefly.count }).map(
      _ => new Firefly()
    )
  }

  private buildServices() {
    this.services = [
      new LifeService(this.api, this.configs.life),
      new ShapeService(this.api, this.configs.shape),
      new ChangingValueService(this.api, "size", this.configs.size, ServiceName.Size),
      new ColorBinderService(this.api),
      new BoundService(this.api, this.configs.bound),
      // new CollisionService(this.api, this.configs.collision, this, this.collision),
      /* ========= Speed ============ */
      new ChangingValueService(this.api, "speedX", this.configs.speed.speedX, ServiceName.SpeedX),
      new ChangingValueService(this.api, "speedY", this.configs.speed.speedY, ServiceName.SpeedY),
      new ChangingValueService(this.api, "polarSpeedAngle", this.configs.speed.polarSpeedAngle, ServiceName.PolarSpeedAngle),
      new ChangingValueService(this.api, "polarSpeedAmount", this.configs.speed.polarSpeedAmount, ServiceName.PolarSpeedAmount),
      /* ============================ */
      /* ========= Jitter ============ */
      new ChangingValueService(this.api, "jitterX", this.configs.jitter.jitterX, ServiceName.JitterY),
      new ChangingValueService(this.api, "jitterY", this.configs.jitter.jitterY, ServiceName.JitterY),
      new ChangingValueService(this.api, "jitterPolarAngle", this.configs.jitter.jitterPolarAngle, ServiceName.JitterPolarAngle),
      new ChangingValueService(this.api, "jitterPolarAmount", this.configs.jitter.jitterPolarAmount, ServiceName.JitterPolarAmount),
      /* ============================ */
      new ChangingValueService(this.api, "rotation", this.configs.rotation, ServiceName.Rotation),
      new LocationService(this.api, this.configs.location),
      new WindowService(this.api, this.configs.window, this.windowContext),
      new NeighbourhoodService(this.api, this.configs.neighbourhood),
      new GlobalFireflyModifierService(this.api, this.configs.globalFireflyModifier),
      new DrawService(this.api, this.configs.draw),
    ]
  }

  public togglePauseApplication(
    value?: boolean
  ): void {
    this.paused = value === undefined ? !this.paused : value;

    if (!this.paused) {
      requestAnimationFrame(this.run);
    }
  }

  public setServicesOnSingleFirefly(firefly: Firefly) {
    for (let service of this.services) {
      service.addFireflies([firefly]);
    }
  }

  public setServicesOnSingleFireflyByServiceNames(firefly: Firefly, ...names: ServiceName[]) {
    for (const s of this.services) {
      if (s instanceof ColorBinderService) {
        names.forEach(
          n => {
            if (
              n === ServiceName.Hue ||
              n === ServiceName.Alpha ||
              n === ServiceName.Saturation ||
              n === ServiceName.Lightness
            ) {
              s.addFireflies([firefly], n);
            }
          }
        )
      }
      else if (names.includes(s.name)) {
        s.addFireflies([firefly]);
      }
    }
  }

  public setServices() {
    for (let service of this.services) {
      service.setOnEveryFirefly()
    }

    this.fireflies.forEach(
      (ff) => {
        ff.initialFireflySnapshot = {
          ...ff,
          initialFireflySnapshot: null,
        }
      }
    )
  }

  public removeFirefly(firefly: Firefly): void {
    for (const s of this.services) {
      s.removeFireflies([firefly]);
    }
  }

  public removeFireflyFromServices(firefly: Firefly, ...names: ServiceName[]) {
    for (const s of this.services) {
      if (s instanceof ColorBinderService) {
        names.forEach(
          n => {
            if (
              n === ServiceName.Hue ||
              n === ServiceName.Alpha ||
              n === ServiceName.Saturation ||
              n === ServiceName.Lightness
            ) {
              s.removeFireflies([firefly], n);
            }
          }
        )
      }
      else if (names.includes(s.name)) {
        s.removeFireflies([firefly]);
      }
    }
  }

  public markFireflyAsCandidate(firefly: Firefly): void {
    const neighbourhoodService = this.services.find(s => s instanceof NeighbourhoodService);

    neighbourhoodService?.markFireflyAsCandidate(firefly)
  }


  public run = (): void => {


    for (let service of this.services) {
      service.onFramePass();
    }

    // const avgSpeedX = Math.floor((this.fireflies.map(ff => ff.speedX).reduce((a, b) => a + Math.abs(b) / this.fireflies.length, 0)) * 100) / 100
    // const avgSpeedY = Math.floor((this.fireflies.map(ff => ff.speedY).reduce((a, b) => a + Math.abs(b) / this.fireflies.length, 0)) * 100) / 100

    // this.canvas.renderingContext2d!.fillStyle  = "white"
    // this.canvas.renderingContext2d!.font = "48px serif";
    // this.canvas.renderingContext!.fillText(`avgSpeedX: ${avgSpeedX}`, 100, 100);
    // this.canvas.renderingContext!.fillText(`avgSpeedY: ${avgSpeedY}`, 100, 150);


    // this.fireflies.forEach((ff, i) => {
    //   this.canvas.renderingContext2d!.font = "30px serif";
    //   this.canvas.renderingContext2d!.fillStyle = 'white'
    //   // this.canvas.renderingContext!.fillText((isFinite(Math.floor(ff.life)) ? Math.floor(ff.life) : '').toString(), ff.x, ff.y);
    // })

    if (!this.paused) {
      requestAnimationFrame(this.run);
    }
  }
}



// currentFirefly.x = current * 2 * Math.random() - current
// currentFirefly.y += current * 2 * Math.random() - current