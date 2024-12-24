import { ServiceName } from "./enums";
import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";
import { AccelerationService, BoundService, ChangingValueService, DrawService, GlobalFireflyModifierService, JitterService, LocationService, RotationService, ShapeService, SpeedService, WindowService } from "./services";
import { AccelerationConfig, BoundsConfig, ChangingValueConfig, GeneralFireflyConfig, LocationConfig, ServiceMap, ShapeConfig, SpeedConfig } from "./types";

export class FireflyApp {

  private canvas: FireflyCanvas
  private fireflies: Firefly[] = [];
  private serviceMaps: ServiceMap[] = [];
  private services: Service[] = [];

  constructor(
    canvas: FireflyCanvas,
    private readonly windowContext: Window & typeof globalThis,
    private readonly generalFireflyConfig: GeneralFireflyConfig,
    serviceMaps: ServiceMap[],
  ) {

    this.canvas = canvas;
    this.serviceMaps = serviceMaps;
    this.createFireflies();
    // services will execute here
    this.buildServices();
    this.setServices();
  }

  private createFireflies(): void {
    this.fireflies = Array(this.generalFireflyConfig.count).fill(0).map(
      _ => new Firefly()
    )
  }

  private isChangingValueConfig(config: unknown): config is ChangingValueConfig {
    return true
  }

  private isSpeedConfig(config: unknown): config is SpeedConfig {
    return (
      config !== null &&
      typeof config === "object" &&
      "type" in config
    )
  }

  private isShapeConfig(config: unknown): config is ShapeConfig {
    return (
      config !== null &&
      typeof config === "object" &&
      "setMethod" in config
    )
  }

  private isBoundsConfig(config: unknown): config is BoundsConfig {
    return (
      config !== null &&
      typeof config === "object" &&
      "type" in config
    )
  }

  private isLocationConfig(config: unknown): config is LocationConfig {
    return (
      config !== null &&
      typeof config === "object"
    )
  }

  private isAccelerationConfig(config: unknown): config is AccelerationConfig {
    return (
      config !== null &&
      typeof config === "object" &&
      "type" in config
    )
  }

  private buildServices() {
    this.serviceMaps.forEach((serviceMap) => {

      switch (serviceMap.name) {
        case "hue":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(
              new ChangingValueService(
                "hue", 
                this.canvas,
                this.fireflies,
                serviceMap.config,
                ServiceName.Hue,
                this
              )
            );
          break;
        case "saturation":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("saturation", this.canvas, this.fireflies, serviceMap.config, ServiceName.Saturation, this));
          break;
        case "lightness":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("lightness", this.canvas, this.fireflies, serviceMap.config, ServiceName.Lightness, this));
          break;
        case "alpha":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("alpha", this.canvas, this.fireflies, serviceMap.config, ServiceName.Alpha, this));
          break;
        case "size":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("size", this.canvas, this.fireflies, serviceMap.config, ServiceName.Size, this));
          break;
        case "speed":
          if (this.isSpeedConfig(serviceMap.config))
            this.services.push(new SpeedService(this.canvas, this.fireflies, serviceMap.config, this));
          break;
        case "acceleration":
          if (this.isAccelerationConfig(serviceMap.config))
            this.services.push(new AccelerationService(this.canvas, this.fireflies, serviceMap.config, this));
          break;
        case "shape":
          if (this.isShapeConfig(serviceMap.config))
            this.services.push(new ShapeService(this.canvas, this.fireflies, serviceMap.config, this));
          break;
        case "location":
          if (this.isLocationConfig(serviceMap.config))
            this.services.push(new LocationService(this.canvas, this.fireflies, serviceMap.config, this));
          break;
        case "bound":
          this.services.push(new BoundService(this.canvas, this.fireflies, serviceMap.config as any, this));
          break;
        case "draw":
          this.services.push(new DrawService(this.canvas, this.fireflies));
          break;
        case "window":
          this.services.push(new WindowService(
            this.canvas,
            this.fireflies,
            serviceMap.config,
            this.windowContext,
            this
          ))
          break;
        case ServiceName.Rotation:
          this.services.push(
            new RotationService(
              this.canvas,
              this.fireflies,
              serviceMap.config as any,
              this
            )
          );
          break;

          case ServiceName.Jitter:
            this.services.push(
              new JitterService(
                this.canvas,
                this.fireflies,
                serviceMap.config as any,
                this
              )
            )
            break;

          case ServiceName.GlobalFireflyModifier:
            this.services.push(
              new GlobalFireflyModifierService(
                this.canvas,
                this.fireflies,
                serviceMap.config as any,
                this
              )
            )
      }
    })
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

  public run = (): void => {
    requestAnimationFrame(this.run)
    this.canvas.renderingContext?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      for (let service of this.services) {
        service.onFramePass();
      }
  }
}