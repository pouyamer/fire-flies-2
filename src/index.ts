import { FireflyApp } from "./core";
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

  const app = new FireflyApp(canvas, window);

  app.run()
}