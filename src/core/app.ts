import { ServiceName } from "./enums";
import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";
import { AccelerationService, BoundService, ChangingValueService, DrawService, LocationService, ShapeService, SpeedService, WindowService } from "./services";
import { AccelerationConfig, BoundsConfig, ChangingValueConfig, LocationConfig, ServiceMap, ShapeConfig, SpeedConfig } from "./types";

export class App {

  private canvas: FireflyCanvas
  private fireflies: Firefly[];
  private serviceMaps: ServiceMap[] = [];
  private services: Service[] = [];

  constructor(
    canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly windowContext: Window & typeof globalThis,
    serviceMaps: ServiceMap[],
  ) {
    this.canvas = canvas;
    this.fireflies = fireflies;
    this.serviceMaps = serviceMaps;
    // services will execute here
    this.buildServices();
    this.setServices();
  }

  private isChangingValueConfig(config: unknown): config is ChangingValueConfig {
    return (
      config !== null &&
      typeof config === "object" &&
      "type" in config &&
      "value" in config
    )
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
      "type" in config
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
      typeof config === "object" &&
      "type" in config
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
            this.services.push(new ChangingValueService("hue", this.canvas, this.fireflies, serviceMap.config, ServiceName.Hue));
          break;
        case "saturation":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("saturation", this.canvas, this.fireflies, serviceMap.config, ServiceName.Saturation));
          break;
        case "lightness":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("lightness", this.canvas, this.fireflies, serviceMap.config, ServiceName.Lightness));
          break;
        case "alpha":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("alpha", this.canvas, this.fireflies, serviceMap.config, ServiceName.Alpha));
          break;
        case "size":
          if (this.isChangingValueConfig(serviceMap.config))
            this.services.push(new ChangingValueService("size", this.canvas, this.fireflies, serviceMap.config, ServiceName.Size));
          break;
        case "speed":
          if (this.isSpeedConfig(serviceMap.config))
            this.services.push(new SpeedService(this.canvas, this.fireflies, serviceMap.config));
          break;
        case "acceleration":
          if (this.isAccelerationConfig(serviceMap.config))
            this.services.push(new AccelerationService(this.canvas, this.fireflies, serviceMap.config));
          break;
        case "shape":
          if (this.isShapeConfig(serviceMap.config))
            this.services.push(new ShapeService(this.canvas, this.fireflies, serviceMap.config));
          break;
        case "location":
          if (this.isLocationConfig(serviceMap.config))
            this.services.push(new LocationService(this.canvas, this.fireflies, serviceMap.config));
          break;
        case "bound":
          this.services.push(new BoundService(this.canvas, this.fireflies, serviceMap.config as any));
          break;
        case "draw":
          this.services.push(new DrawService(this.canvas, this.fireflies));
          break;
        case "window":
          this.services.push(new WindowService(
            this.canvas,
            this.fireflies,
            serviceMap.config,
            this.windowContext
          ))
          break;
      }
    })
  }

  private resetServices(firefly: Firefly) {
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