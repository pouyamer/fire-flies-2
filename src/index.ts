import { App } from "./core";
import { accelerationConfig, alphaConfig, hueConfig, lightnessConfig, locationConfig, saturationConfig, shapeConfig, sizeConfig, speedConfig } from "./core/configs";
import { DEFAULT_SERVICE_MAP } from "./core/constants";
import { Color, Firefly, FireflyCanvas } from "./core/models";
import { AccelerationService, ChangingValueService, DrawService, LocationService, ShapeService, SpeedService } from "./core/services";

const canvasElement: HTMLCanvasElement | null = document.querySelector(".canvas");

const canvas = new FireflyCanvas({
  color: new Color({
    alpha: 1,
    hue: 0,
    lightness: 0.1,
    saturation: 0
  }),
  height: innerHeight,
  width: innerWidth,
  viewElement: canvasElement,
})

const fireflies = Array(200).fill(0).map(_ => new Firefly({
  key: Math.floor(
    Math.random() * 10000
  ) + "-" + Math.random() * 2000
})
)

if (canvas) {

  const app = new App(canvas, fireflies, window, [
    DEFAULT_SERVICE_MAP.hue,
    DEFAULT_SERVICE_MAP.saturation,
    DEFAULT_SERVICE_MAP.alpha,
    DEFAULT_SERVICE_MAP.lightness,
    DEFAULT_SERVICE_MAP.location,
    DEFAULT_SERVICE_MAP.bound,
    DEFAULT_SERVICE_MAP.speed,
    DEFAULT_SERVICE_MAP.acceleration,
    DEFAULT_SERVICE_MAP.size,
    DEFAULT_SERVICE_MAP.shape,
    DEFAULT_SERVICE_MAP.draw,
    DEFAULT_SERVICE_MAP.window,
  ]);

  app.run()
}