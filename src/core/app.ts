import { accelerationConfig, alphaConfig, boundsConfig, collisionConfig, generalFireflyConfig, globalFireflyModifierConfig, hueConfig, jitterConfig, lightnessConfig, locationConfig, rotationConfig, saturationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "./configs";
import { ServiceName } from "./enums";
import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";
import { AccelerationService, BoundService, ChangingValueService, CollisionService, DrawService, GlobalFireflyModifierService, JitterService, LocationService, RotationService, ShapeService, SpeedService, WindowService } from "./services";
import { AccelerationConfig, BoundsConfig, ChangingValueConfig, CollisionConfig, GeneralFireflyConfig, GlobalFireflyModifierConfig, JitterConfig, LocationConfig, RotationConfig, ShapeConfig, SpeedConfig, WindowConfig } from "./types";
import { Utilities } from "./utilities";

interface Configs {
  acceleration: AccelerationConfig;
  alpha: ChangingValueConfig;
  bound: BoundsConfig;
  collision: CollisionConfig;
  draw: null;
  generalFireflyConfig: GeneralFireflyConfig;
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
    generalFireflyConfig: generalFireflyConfig
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
    this.fireflies = Array(this.configs.generalFireflyConfig.count).fill(0).map(
      _ => new Firefly()
    )
  }

  private buildServices() {
    this.services = [
      new AccelerationService(this.canvas, this.fireflies, this.configs.acceleration, this),
      new ChangingValueService("alpha", this.canvas, this.fireflies, this.configs.alpha, ServiceName.Alpha, this),
      new BoundService(this.canvas, this.fireflies, this.configs.bound, this),
      new CollisionService(this.canvas, this.fireflies, this.configs.collision, this, this.collision),
      new GlobalFireflyModifierService(this.canvas, this.fireflies, this.configs.globalFireflyModifier, this),
      new ChangingValueService("hue", this.canvas, this.fireflies, this.configs.hue, ServiceName.Alpha, this),
      new ChangingValueService("saturation", this.canvas, this.fireflies, this.configs.saturation, ServiceName.Saturation, this),
      new ChangingValueService("lightness", this.canvas, this.fireflies, this.configs.lightness, ServiceName.Lightness, this),
      new ChangingValueService("size", this.canvas, this.fireflies, this.configs.size, ServiceName.Size, this),
      new SpeedService(this.canvas, this.fireflies, this.configs.speed, this),
      new ShapeService(this.canvas, this.fireflies, this.configs.shape, this),
      new LocationService(this.canvas, this.fireflies, this.configs.location, this),
      new WindowService(this.canvas, this.fireflies, this.configs.window, this.windowContext, this),
      new RotationService(this.canvas, this.fireflies, this.configs.rotation, this),
      new JitterService(this.canvas, this.fireflies, this.configs.jitter, this),
      new DrawService(this.canvas, this.fireflies),
    ]
  }

  public setServicesOnSingleFirefly(firefly: Firefly) {
    for (let service of this.services) {
      service.setOnSingleFirefly(firefly)
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

  private testFirefly: Firefly | null  = null; //TEST

  public run = (): void => {

    const distance = 100 //TEST

    requestAnimationFrame(this.run);

    if(this.testFirefly === null && this.fireflies[0]){this.testFirefly = this.fireflies[0]} //TEST

    this.canvas.renderingContext?.clearRect(0, 0, this.canvas.width, this.canvas.height)

    
     





    for (let service of this.services) {
      service.onFramePass();
    }

      if(this.testFirefly){
      // this.canvas.renderingContext!.fillStyle = "yellow"
      // this.canvas.renderingContext?.beginPath()
      // this.canvas.renderingContext?.arc(this.testFirefly.x, this.testFirefly.y, distance, 0, 2 * Math.PI)
      // this.canvas.renderingContext?.moveTo(this.testFirefly.x, this.testFirefly.y)
      // this.canvas.renderingContext?.fill()

      const nonNeighboredFireflies = this.fireflies.filter(
        ff => ff.neighboredBy === null || ff.neighboredBy === this.testFirefly
      ) //TEST

      this.fireflies.filter(ff=> ff.neighboredBy === this.testFirefly).forEach(
        (ff, i, neighbors) => {
          const distanceBetweenTwoFireflies = Utilities.calculateDistance(
            this.testFirefly?.x ?? 0,
            this.testFirefly?.y ?? 0,
            ff?.x ?? 0,
            ff?.y ?? 0,
          )

          if (distanceBetweenTwoFireflies > distance) {
            this.testFirefly!.neighbors = neighbors.filter(n => n !== ff) 
            ff.neighboredBy = null
            // onNeighborhoodExit
            // ff.hue.value = 3
            // ff.size.value = 0
          } 
        }
      )

      // previous nearby fireflies
      const previousNearByFireflies = this.testFirefly!.neighbors


      // idetifying nearbyFireflies
      const nearbyFireflies = nonNeighboredFireflies.filter(nnff => {
        const distanceBetweenTwoFireflies = Utilities.calculateDistance(
          this.testFirefly?.x ?? 0,
          this.testFirefly?.y ?? 0,
          nnff?.x ?? 0,
          nnff?.y ?? 0,
        )

        return distanceBetweenTwoFireflies <= distance && nnff !== this.testFirefly
      })

      // making neighborhood
      this.testFirefly!.neighbors = nearbyFireflies
      nearbyFireflies.forEach(
        nbff => {
          nbff.neighboredBy = this.testFirefly;
        }
      )

      const newFireFlies = nearbyFireflies.filter(
        ff => !previousNearByFireflies.includes(ff)
      )

      // onNeighborhoodEnter
      newFireFlies.forEach(
        ff => {
          ff.hue.value += 10
        }
      )

      
      //onNeighborhood
      this.testFirefly!.neighbors.forEach(
        ff => {
          ff.size.value += .1

        }
      )


    } //TEST




    
    
    
    
  }
}