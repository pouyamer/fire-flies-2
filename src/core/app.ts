import { ALL_SERVICE_KEYS, FIREFLY_SERVICE_DEFAULT_CONFIGS } from "./constants";
import { Mutator, MutatorGroup } from "./interfaces";
import { Firefly, FireflyCanvas, FireflyServiceToggleKey, FireflyServiceToggleKeyNotRequiringFirefly, FireflyServiceToggleKeyRequiringFirefly, IFireflyCanvasProps } from "./models";
import { BoundService, ChangingValueService, CollisionService, ColorBinderService, DrawLoopService, DrawService, GlobalFireflyModifierService, LifeService, LocationService, NeighbourhoodService, OwnershipService, ShapeService, SimulationLoopService, WindowService } from "./services";
import { Arc, FireflyAppApi, FireflyAppApiGetter, FireflyAppMethods, FireflyColorInfoConfig, FireflyServiceConfigs, GeneralFireflyConfig, Line } from "./types";
import { deepMerge, isOwnable } from "./utilities";

export class FireflyApp {

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private configs: FireflyServiceConfigs = FIREFLY_SERVICE_DEFAULT_CONFIGS;
  private lines: Line[] = [];
  private arcs: Arc[] = [];
  private services: (Mutator | MutatorGroup)[] = [];



  private paused: boolean = false;

  private readonly apiMethods: FireflyAppMethods = {
    disposeLine: this.disposeLine.bind(this),
    addLine: this.addLine.bind(this),
    disposeArc: this.disposeArc.bind(this),
    addArc: this.addArc.bind(this),
    getConfig: this.getConfig.bind(this),
    resetServicesOnFireflyByKeys: this.resetServicesOnFireflyByKeys.bind(this),
    resetServicesByKeys: this.resetServicesByKeys.bind(this),
    haltServicesOnFireflyByKeys: this.haltServicesOnFireflyByKeys.bind(this),
    addFireflyToService: this.addFireflyToService.bind(this),
    togglePauseApplication: this.togglePauseApplication.bind(this),
    markFireflyAsCandidate: this.markFireflyAsCandidate.bind(this),
    getServiceByKey: this.getServiceByKey.bind(this)
  };

  private _api(): FireflyAppApi;
  private _api(query: 'configs'): FireflyAppApi['configs'];
  private _api(query: 'fireflies'): Firefly[];
  private _api(query: 'canvas'): FireflyCanvas;
  private _api(query: 'lines'): Line[];
  private _api(query: 'arcs'): Arc[];
  private _api(query: 'methods'): FireflyAppMethods;
  private _api(query?: keyof FireflyAppApi): FireflyAppApi[keyof FireflyAppApi] | FireflyAppApi {

    const configs: FireflyAppApi['configs'] = {
      colorInfo: this.colorConfigInfo,
      general: this.generalConfig,
    }

    if (!query) {
      return {
        fireflies: this.fireflies,
        canvas: this.canvas,
        lines: this.lines,
        arcs: this.arcs,
        methods: this.apiMethods,
        configs: configs,
      }
    }
    switch (query) {
      case "configs":
        return configs;
      case "fireflies":
        return this.fireflies;
      case "canvas":
        return this.canvas;
      case "lines":
        return this.lines;
      case "arcs":
        return this.arcs;
      case "methods":
        return this.apiMethods;
    }
  }

  private api: FireflyAppApiGetter = this._api.bind(this)

  private ownership: OwnershipService;

  private simLoop = new SimulationLoopService(
    this.api,
    () => [...this.services, this.ownership],
    this.generalConfig.simulationFPS ?? 60
  );

  private drawLoop = new DrawLoopService(
    () => this.getServiceByKey('draw') as DrawService,
    this.generalConfig.drawFPS ?? 60
  );



  constructor(app: {
    canvas: IFireflyCanvasProps,
    configs?: Partial<FireflyServiceConfigs>
  }) {

    this.canvas = new FireflyCanvas(app.canvas);
    this.configs = deepMerge(FIREFLY_SERVICE_DEFAULT_CONFIGS, app.configs);
    this.createFireflies();

    this.ownership = new OwnershipService(this.fireflies)

    // services will execute here
    this.buildServices();
    this.registerOwnables();
    this.ownership.init();
    this.setServices();
  }


  private get generalConfig(): GeneralFireflyConfig {
    return this.configs.generalFirefly;
  }

  private get colorConfigInfo(): FireflyColorInfoConfig {
    return this.configs.generalFirefly.colorMode === 'HSL'
      ? {
        type: 'HSL', config: this.configs.hslColor
      }
      : {
        type: 'RGB', config: this.configs.rgbColor,
      }
  }

  private disposeLine(line: Line): void {
    this.lines = this.lines.filter(l => line !== l)
  }

  private addLine(line: Line): void {
    this.lines.push(line)
  }

  private disposeArc(arc: Arc): void {
    this.arcs = this.arcs.filter(a => arc !== a)
  }

  private addArc(arc: Arc): void {
    this.arcs.push(arc)
  }

  private getConfig(key: keyof FireflyServiceConfigs) {
    return this.configs[key];
  }


  private createFireflies(): void {
    this.fireflies = Array.from({ length: this.configs.generalFirefly.count }).map(
      _ => new Firefly()
    )
  }

  private getServiceByKey(key: FireflyServiceToggleKey): Mutator | undefined {
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

  private getServices(): (Mutator | MutatorGroup)[]
  private getServices(type: 'exclusive', ...keys: FireflyServiceToggleKey[]): (Mutator | MutatorGroup)[]
  private getServices(type: 'inclusive', ...keys: FireflyServiceToggleKey[]): (Mutator | MutatorGroup)[] 
  private getServices(type?: 'inclusive' | 'exclusive', ...keys: FireflyServiceToggleKey[]): (Mutator | MutatorGroup)[] {
    if (!type) {
      return this.services;
    }
    else {
      switch(type) {
        case "exclusive":
          return ALL_SERVICE_KEYS.filter(key => !keys.includes(key)).map(k => this.getServiceByKey(k)).filter(s => s !== undefined)
        case "inclusive":
          return keys.map(k => this.getServiceByKey(k)).filter(s => s !== undefined)
      }
    }
  }

  private resetServicesOnFireflyByKeys(firefly: Firefly, ...keys: FireflyServiceToggleKeyRequiringFirefly[]): void {
    keys.forEach(key => {
      const service = this.getServiceByKey(key as FireflyServiceToggleKey);

      if (service) {
        service.setOne(firefly)
      }

    })
  }

  private resetServicesByKeys(...keys: FireflyServiceToggleKeyNotRequiringFirefly[]): void {
    keys.forEach(key => {
      const service = this.getServiceByKey(key as FireflyServiceToggleKey);

      if (service) {
        service.set()
      }

    })
  }

  private haltServicesOnFireflyByKeys(firefly: Firefly, ...keys: FireflyServiceToggleKey[]): void {
    keys.forEach(key => {
       firefly.serviceToggle.halt(key);
    })
  }

  private addFireflyToService(firefly: Firefly, key: FireflyServiceToggleKey): void {
    const service = this.getServiceByKey(key);

    if (service) {
      firefly.serviceToggle.activate(key);
      service.setOne(firefly);
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
      new WindowService(this.api, this.configs.window),
      new NeighbourhoodService(this.api, this.configs.neighbourhood),
      new CollisionService(),
      new GlobalFireflyModifierService(this.api, this.configs.globalFireflyModifier),
      new DrawService(this.api, this.configs.draw),
    ]

  }

  private registerOwnables(): void {
    for (const s of this.services) {
      if (isOwnable(s)) {
        this.ownership.register(s)
      }
    }
  }

  private togglePauseApplication(value?: boolean): void {
    this.paused = value === undefined ? !this.paused : value;

    if (this.paused) {
      this.simLoop.stop();
      this.drawLoop.stop();
    } else {
      this.simLoop.start();
      this.drawLoop.start();
    }
  }

  private setServices() {
    ALL_SERVICE_KEYS.forEach(
      sKey => {
        this.fireflies.forEach(ff => this.addFireflyToService(ff, sKey))
        if (['bounds', 'neighbourhood', 'window'].includes(sKey)) {
          this.getServiceByKey(sKey)?.set();
        }
      }
    )

    // this.fireflies.forEach(
    //   (ff) => {
    //     ff.initialFireflySnapshot = {
    //       ...ff,
    //       initialFireflySnapshot: null,
    //     }
    //   }
    // )
  }


  private markFireflyAsCandidate(firefly: Firefly): void {
    const neighbourhoodService = this.services.find(s => s instanceof NeighbourhoodService);

    neighbourhoodService?.markFireflyAsCandidate(firefly)
  }



  public run(): void {
    if (!this.paused) {
      this.simLoop.start();
      this.drawLoop.start();
    }
  }
}