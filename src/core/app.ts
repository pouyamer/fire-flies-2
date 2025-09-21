import { alphaConfig, boundsConfig, collisionConfig, drawConfig, generalFireflyConfig, globalFireflyModifierConfig, hueConfig, jitterConfig, lifeConfig, lightnessConfig, locationConfig, neighbourhoodConfig, rotationConfig, saturationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "./configs";
import { ServiceName } from "./enums";
import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";
import { BoundService, ChangingValueService, CollisionService, DrawService, GlobalFireflyModifierService, JitterService, LifeService, LocationService, NeighbourhoodService, RotationService, ShapeService, WindowService } from "./services";
import { BoundsConfig, ChangingValueConfig, CollisionConfig, DrawConfig, GeneralFireflyConfig, GlobalFireflyModifierConfig, JitterConfig, LifeConfig, LocationConfig, NeighbourhoodConfig, RotationConfig, ShapeConfig, SpeedConfig, WindowConfig } from "./types";
import { Utilities } from "./utilities";

interface Configs {
  alpha: ChangingValueConfig;
  bound: BoundsConfig;
  collision: CollisionConfig;
  generalFirefly: GeneralFireflyConfig;
  globalFireflyModifier: GlobalFireflyModifierConfig;
  hue: ChangingValueConfig;
  jitter: JitterConfig;
  lightness: ChangingValueConfig;
  location:  LocationConfig;
  rotation: RotationConfig;
  saturation: ChangingValueConfig;
  shape:  ShapeConfig;
  size: ChangingValueConfig;
  speed: SpeedConfig;
  window: WindowConfig;
  neighbourhood: NeighbourhoodConfig;
  draw: DrawConfig;
  life: LifeConfig;
}

export class FireflyApp {

  private readonly defaultConfigs: Configs = {
    alpha: alphaConfig,
    bound: boundsConfig,
    collision: collisionConfig,
    draw: drawConfig,
    globalFireflyModifier: globalFireflyModifierConfig,
    hue: hueConfig,
    jitter: jitterConfig,
    lightness: lightnessConfig,
    location: locationConfig,
    rotation: rotationConfig,
    saturation: saturationConfig,
    shape: shapeConfig,
    size: sizeConfig,
    speed: speedConfig,
    window: windowConfig,
    generalFirefly: generalFireflyConfig,
    neighbourhood: neighbourhoodConfig,
    life: lifeConfig
  }

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private configs: Configs = this.defaultConfigs;
  private services: Service[] = [];
  private collision: Firefly[][] = [];
  private paused: boolean = false;

  constructor(
    canvas: FireflyCanvas,
    private readonly windowContext: Window & typeof globalThis,
    configs: Partial<Configs> = this.defaultConfigs
  ) {

    this.canvas = canvas;
    this.configs = Utilities.deepMerge(this.defaultConfigs, configs);
    this.createFireflies();
    // services will execute here
    this.buildServices();
    this.setServices();
  }

  private createFireflies(): void {
    this.fireflies = Array(this.configs.generalFirefly.count).fill(0).map(
      _ => new Firefly()
    )
  }

  private buildServices() {
    this.services = [
      new LifeService(this.canvas, this.fireflies, this.configs.life, this),
      new ShapeService(this.canvas, this.fireflies, this.configs.shape, this),
      new ChangingValueService("hue", this.canvas, this.fireflies, this.configs.hue, ServiceName.Hue, this),
      new ChangingValueService("saturation", this.canvas, this.fireflies, this.configs.saturation, ServiceName.Saturation, this),
      new ChangingValueService("lightness", this.canvas, this.fireflies, this.configs.lightness, ServiceName.Lightness, this),
      new ChangingValueService("size", this.canvas, this.fireflies, this.configs.size, ServiceName.Size, this),
      new ChangingValueService("alpha", this.canvas, this.fireflies, this.configs.alpha, ServiceName.Alpha, this),
      new BoundService(this.canvas, this.fireflies, this.configs.bound, this),
      new CollisionService(this.canvas, this.fireflies, this.configs.collision, this, this.collision),
      /* ========= Speed ============ */
      new ChangingValueService("speedX", this.canvas, this.fireflies, this.configs.speed.speedX, ServiceName.SpeedX, this),
      new ChangingValueService("speedY", this.canvas, this.fireflies, this.configs.speed.speedY, ServiceName.SpeedY, this),
      new ChangingValueService("polarSpeedAngle", this.canvas, this.fireflies, this.configs.speed.polarSpeedAngle, ServiceName.PolarSpeedAngle, this),
      new ChangingValueService("polarSpeedAmount", this.canvas, this.fireflies, this.configs.speed.polarSpeedAmount, ServiceName.PolarSpeedAmount, this),
      /* ============================ */
      new LocationService(this.canvas, this.fireflies, this.configs.location, this),
      new WindowService(this.canvas, this.fireflies, this.configs.window, this.windowContext, this),
      new RotationService(this.canvas, this.fireflies, this.configs.rotation, this),
      new JitterService(this.canvas, this.fireflies, this.configs.jitter, this),
      new NeighbourhoodService(this.canvas, this.fireflies, this.configs.neighbourhood, this),
      new GlobalFireflyModifierService(this.canvas, this.fireflies, this.configs.globalFireflyModifier, this),
      new DrawService(this.canvas, this.fireflies, this.configs.draw, this),
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
      service.setOnSingleFirefly(firefly)
    }
  }

  public setServicesOnSingleFireflyByServiceNames(firefly: Firefly, ...names: ServiceName[]) {
    for(const service of this.services) {
      if (names.includes(service.name)) {
        service.setOnSingleFirefly(firefly);
      }
    }
  }

  public setServices() {
    for (let service of this.services) {
      service.setOnEveryFirefly()
    }
    
    this.fireflies.forEach(
      (ff, i) => {
        ff.initialFireflySnapshot = {
          ...ff,
          initialFireflySnapshot: null,
        }
      }
    )
  }

  public removeFirefly(firefly: Firefly): void {
    for (let i = this.fireflies.length - 1; i >= 0; i--) {
      if (this.fireflies[i].key === firefly.key) {
        this.fireflies.splice(i, 1);
      }
    }
  }

  public markFireflyAsCandidate(firefly: Firefly): void {
    const neighbourhoodService = this.services.find(s => s.name === ServiceName.Neighbourhood) as NeighbourhoodService;

    neighbourhoodService.markFireflyAsCandidate(firefly)
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

    if(!this.paused) {
      requestAnimationFrame(this.run);
    }
  }
}