import { FireflyApp } from "./core";
import { generalFireflyConfig } from "./core/configs";
import { DEFAULT_SERVICE_MAP } from "./core/constants";
import { Color, FireflyCanvas } from "./core/models";

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

if (canvas) {

  const app = new FireflyApp(canvas, window, generalFireflyConfig, [
    DEFAULT_SERVICE_MAP.hue,
    DEFAULT_SERVICE_MAP.saturation,
    DEFAULT_SERVICE_MAP.alpha,
    DEFAULT_SERVICE_MAP.lightness,
    DEFAULT_SERVICE_MAP.location,
    DEFAULT_SERVICE_MAP.bound,
    DEFAULT_SERVICE_MAP.speed,
    DEFAULT_SERVICE_MAP.acceleration,
    DEFAULT_SERVICE_MAP.rotation,
    DEFAULT_SERVICE_MAP.size,
    DEFAULT_SERVICE_MAP.shape,
    DEFAULT_SERVICE_MAP.draw,
    DEFAULT_SERVICE_MAP.window,
  ]);

  app.run()
}