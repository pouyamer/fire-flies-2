import { boundsConfig, collisionConfig, drawConfig, generalFireflyConfig, globalFireflyModifierConfig, hslColorConfig, jitterConfig, lifeConfig, locationConfig, neighbourhoodConfig, rgbColorConfig, rotationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "./configs";
import { ServiceName } from "./enums";
import { Firefly, FireflyCanvas, InteractiveLine } from "./models";
import { BoundService, ChangingValueService, DrawService, GlobalFireflyModifierService, LifeService, LocationService, NeighbourhoodService, ShapeService, WindowService } from "./services";
import { ColorBinderService } from "./services/color-binder.service";
import { BoundsConfig, ChangingValueConfig, CollisionConfig, DrawConfig, FireflyAppApi, GeneralFireflyConfig, GlobalFireflyModifierConfig, HslColorConfig, JitterConfig, LifeConfig, LocationConfig, NeighbourhoodConfig, RgbColorConfig, ShapeConfig, SpeedConfig, WindowConfig } from "./types";
import { Utilities } from "./utilities";

interface Configs {
  bound: BoundsConfig;
  collision: CollisionConfig;
  generalFirefly: GeneralFireflyConfig;
  globalFireflyModifier: GlobalFireflyModifierConfig;
  jitter: JitterConfig;
  location: LocationConfig;
  rotation: ChangingValueConfig;
  shape: ShapeConfig;
  size: ChangingValueConfig;
  speed: SpeedConfig;
  window: WindowConfig;
  neighbourhood: NeighbourhoodConfig;
  draw: DrawConfig;
  life: LifeConfig;
  hslColor: HslColorConfig,
  rgbColor: RgbColorConfig;
}

export class FireflyApp {

  private readonly defaultConfigs: Configs = {
    bound: boundsConfig,
    collision: collisionConfig,
    draw: drawConfig,
    globalFireflyModifier: globalFireflyModifierConfig,
    jitter: jitterConfig,
    location: locationConfig,
    rotation: rotationConfig,
    shape: shapeConfig,
    size: sizeConfig,
    speed: speedConfig,
    window: windowConfig,
    generalFirefly: generalFireflyConfig,
    neighbourhood: neighbourhoodConfig,
    life: lifeConfig,
    hslColor: hslColorConfig,
    rgbColor: rgbColorConfig,
  }

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private configs: Configs = this.defaultConfigs;
  private lines: InteractiveLine[] = [];
  private services: (
    | LifeService
    | ShapeService
    | ChangingValueService
    | BoundService
    | LocationService
    | WindowService
    | NeighbourhoodService
    | GlobalFireflyModifierService
    | DrawService
    | ColorBinderService
  )[] = [];


  
  private paused: boolean = false;

  private api: FireflyAppApi;


  constructor(
    canvas: FireflyCanvas,
    private readonly windowContext: Window & typeof globalThis,
    configs: Partial<Configs> = this.defaultConfigs
  ) {

    this.canvas = canvas;
    this.configs = Utilities.deepMerge(this.defaultConfigs, configs);
    this.createFireflies();

    this.api = {
      canvas: canvas,
      fireflies: this.fireflies,
      app: this,
      lines: this.lines,
    }

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

  public getConfig(key: keyof Configs) {
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
      new ChangingValueService( this.api, "rotation", this.configs.rotation, ServiceName.Rotation),
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