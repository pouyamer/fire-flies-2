import { FireflyApp } from "./core";
import { FireflyCanvas, HslColor } from "./core/models";

const canvasElement = document.querySelector("body");

const canvas = new FireflyCanvas({
  color: new HslColor({
    alpha: 1,
    hue: 0,
    lightness: 0.1,
    saturation: 0
  }),
  height: innerHeight,
  width: innerWidth,
  hostElement: canvasElement,
})

if (canvas) {

  const app = new FireflyApp(canvas, window);

  app.run()
}