import { ALL_SERVICE_KEYS, FIREFLY_SERVICE_DEFAULT_CONFIGS } from "./constants";
import { Firefly, FireflyCanvas, FireflyServiceToggleKey, FireflyServiceToggleKeyNotRequiringFirefly, FireflyServiceToggleKeyRequiringFirefly } from "./models";
import { BoundService, ChangingValueService, CollisionService, DrawService, GlobalFireflyModifierService, LifeService, LocationService, NeighbourhoodService, ShapeService, WindowService } from "./services";
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
  private _api(query?: keyof FireflyAppApi): FireflyAppApi[keyof FireflyAppApi] | FireflyAppApi {

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
    this.lines = this.lines.filter(l => line !== l)
  }

  public addLine(line: Line): void {
    this.lines.push(line)
  }

  public disposeArc(arc: Arc): void {
    this.arcs = this.arcs.filter(a => arc !== a)
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

  public getServiceByKey(key: FireflyServiceToggleKey): Exclude<ServiceType, ColorBinderService> | undefined {
    switch (key) {
      case "bounds":
        return this.services.find(s => s instanceof BoundService);
      case "collision":
        return this.services.find(s => s instanceof CollisionService)
      case "draw":
        return this.services.find(s => s instanceof DrawService)
      case "globalFireflyModifier":
        return this.services.find(s => s instanceof GlobalFireflyModifierService)
      case "life":
        return this.services.find(s => s instanceof LifeService);
      case "location":
        return this.services.find(s => s instanceof LocationService);
      case "neighbourhood":
        return this.services.find(s => s instanceof NeighbourhoodService);
      case "red":
      case "green":
      case "blue":
      case "alpha":
      case "hue":
      case "saturation":
      case "lightness":
        return this.services.find(s => s instanceof ColorBinderService)?.services?.find(
          s => s.serviceToggleKey === key
        )
      case "shape":
        return this.services.find(s => s instanceof ShapeService);

      case "window":
        return this.services.find(s => s instanceof WindowService);
      case "jitterX":
      case "jitterY":
      case "jitterPolarAngle":
      case "jitterPolarAmount":
      case "size":
      case "speedX":
      case "speedY":
      case "polarSpeedAngle":
      case "polarSpeedAmount":
      case "rotation":
        return this.services.find(s => s instanceof ChangingValueService && s.serviceToggleKey === key) as ChangingValueService;
      default:
        throw new Error(`handle ${key} situation`)
    }
  }

  public resetServicesOnFireflyByKeys(firefly: Firefly, ...keys: FireflyServiceToggleKeyRequiringFirefly): void {
    keys.forEach(key => {
      const service = this.getServiceByKey(key as FireflyServiceToggleKey);

      if (service) {
        service.setOnSingleFirefly(firefly)
      }

    })
  }

  public resetServicesByKeys(...keys: FireflyServiceToggleKeyNotRequiringFirefly[]): void {
    keys.forEach(key => {
      const service = this.getServiceByKey(key as FireflyServiceToggleKey);

      if (service) {
        service.setOnEveryFirefly()
      }

    })
  }

  public haltServicesOnFireflyByKeys(firefly: Firefly, ...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
      this.fireflies.forEach(ff => firefly.serviceToggle.halt(key))

    })
  }

  public addFireflyToService(firefly: Firefly, key: FireflyServiceToggleKey): void {
    const service = this.getServiceByKey(key);

    if (service) {
      service.addFirefly(firefly);
      firefly.serviceToggle.activate(key);
      service.setOnSingleFirefly(firefly);
    }
  }

  private buildServices() {
    this.services = [
      new LifeService(this.api, this.configs.life),
      new ShapeService(this.api, this.configs.shape),
      new ChangingValueService(this.api, "size", this.configs.size, 'size'),
      new ColorBinderService(this.api),
      new BoundService(this.api, this.configs.bound),
      // new CollisionService(this.api, this.configs.collision, this, this.collision),
      /* ========= Speed ============ */
      new ChangingValueService(this.api, "speedX", this.configs.speed.speedX, 'speedX'),
      new ChangingValueService(this.api, "speedY", this.configs.speed.speedY, 'speedY'),
      new ChangingValueService(this.api, "polarSpeedAngle", this.configs.speed.polarSpeedAngle, 'polarSpeedAngle'),
      new ChangingValueService(this.api, "polarSpeedAmount", this.configs.speed.polarSpeedAmount, 'polarSpeedAmount'),
      /* ============================ */
      /* ========= Jitter ============ */
      new ChangingValueService(this.api, "jitterX", this.configs.jitter.jitterX, 'jitterX'),
      new ChangingValueService(this.api, "jitterY", this.configs.jitter.jitterY, 'jitterY'),
      new ChangingValueService(this.api, "jitterPolarAngle", this.configs.jitter.jitterPolarAngle, 'jitterPolarAngle'),
      new ChangingValueService(this.api, "jitterPolarAmount", this.configs.jitter.jitterPolarAmount, 'jitterPolarAmount'),
      /* ============================ */
      new ChangingValueService(this.api, "rotation", this.configs.rotation, 'rotation'),
      new LocationService(this.api, this.configs.location),
      new WindowService(this.api, this.configs.window, this.windowContext),
      new NeighbourhoodService(this.api, this.configs.neighbourhood),
      new CollisionService(),
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

  public setServices() {
    ALL_SERVICE_KEYS.forEach(
      sKey => {
        this.fireflies.forEach(ff => this.addFireflyToService(ff, sKey))
        if(['bounds', 'neighbourhood', 'window'].includes(sKey)) {
          this.getServiceByKey(sKey)?.setOnEveryFirefly();
        }
      }
    )

    this.fireflies.forEach(
      (ff) => {
        ff.initialFireflySnapshot = {
          ...ff,
          initialFireflySnapshot: null,
        }
      }
    )
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