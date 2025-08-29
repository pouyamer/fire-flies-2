import { accelerationConfig, alphaConfig, boundsConfig, collisionConfig, generalFireflyConfig, globalFireflyModifierConfig, hueConfig, jitterConfig, lightnessConfig, locationConfig, neighbourhoodConfig, rotationConfig, saturationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "./configs";
import { ServiceName } from "./enums";
import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";
import { AccelerationService, BoundService, ChangingValueService, CollisionService, DrawService, GlobalFireflyModifierService, JitterService, LocationService, RotationService, ShapeService, SpeedService, WindowService } from "./services";
import { NeighbourhoodService } from "./services/neighbourhood.service";
import { AccelerationConfig, BoundsConfig, ChangingValueConfig, CollisionConfig, GeneralFireflyConfig, GlobalFireflyModifierConfig, JitterConfig, LocationConfig, NeighbourhoodConfig, RotationConfig, ShapeConfig, SpeedConfig, WindowConfig } from "./types";
import { Utilities } from "./utilities";

interface Configs {
  acceleration: AccelerationConfig;
  alpha: ChangingValueConfig;
  bound: BoundsConfig;
  collision: CollisionConfig;
  draw: null;
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
}

export class FireflyApp {

  private readonly defaultConfigs: Configs = {
    acceleration: accelerationConfig,
    alpha: alphaConfig,
    bound: boundsConfig,
    collision: collisionConfig,
    draw: null,
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
  }

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private configs: Configs = this.defaultConfigs;
  private services: Service[] = [];
  private collision: Firefly[][] = [];

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
      new AccelerationService(this.canvas, this.fireflies, this.configs.acceleration, this),
      new ChangingValueService("alpha", this.canvas, this.fireflies, this.configs.alpha, ServiceName.Alpha, this),
      new BoundService(this.canvas, this.fireflies, this.configs.bound, this),
      new CollisionService(this.canvas, this.fireflies, this.configs.collision, this, this.collision),
      new ChangingValueService("hue", this.canvas, this.fireflies, this.configs.hue, ServiceName.Hue, this),
      new ChangingValueService("saturation", this.canvas, this.fireflies, this.configs.saturation, ServiceName.Saturation, this),
      new ChangingValueService("lightness", this.canvas, this.fireflies, this.configs.lightness, ServiceName.Lightness, this),
      new ChangingValueService("size", this.canvas, this.fireflies, this.configs.size, ServiceName.Size, this),
      new SpeedService(this.canvas, this.fireflies, this.configs.speed, this),
      new ShapeService(this.canvas, this.fireflies, this.configs.shape, this),
      new LocationService(this.canvas, this.fireflies, this.configs.location, this),
      new WindowService(this.canvas, this.fireflies, this.configs.window, this.windowContext, this),
      new RotationService(this.canvas, this.fireflies, this.configs.rotation, this),
      new JitterService(this.canvas, this.fireflies, this.configs.jitter, this),
      new NeighbourhoodService(this.canvas, this.fireflies, this.configs.neighbourhood, this),
      new GlobalFireflyModifierService(this.canvas, this.fireflies, this.configs.globalFireflyModifier, this),
      new DrawService(this.canvas, this.fireflies),
    ]
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
      ff => ff.initialFireflySnapshot = {
        ...ff,
        initialFireflySnapshot: null
      }
    )
  }


  public run = (): void => {

    requestAnimationFrame(this.run);


    for (let service of this.services) {
      service.onFramePass();
    } 
  }
}