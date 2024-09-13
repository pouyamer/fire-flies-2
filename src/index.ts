import { App } from "./core";
import { accelerationConfig, speedConfig } from "./core/configs";
import { Color, Firefly, FireflyCanvas } from "./core/models";
import { AccelerationService, DrawService, EventsService, SizeService, SpeedService } from "./core/services";

const canvasElement: HTMLCanvasElement | null = document.querySelector(".canvas");

const canvas = new FireflyCanvas({
  color: new Color({
    alpha: 1,
    hue: 0,
    lightness: 20,
    saturation: 0
  }),
  height: innerHeight,
  width: innerWidth,
  viewElement: canvasElement,
})

const fireflies = Array(100).fill(0).map(_ => new Firefly({
  color: new Color({
    hue: 30 * Math.random(),
    lightness: 70,
    saturation: 75
  }),
  x: 0,
  y: Math.random() * canvas.height,
  size: 20 + Math.random() * 20,
  shape: "circle",
  key: Math.floor(
    Math.random() * 10000
  ) + "-" + Math.random() * 2000
})
)

if (canvas) {

  const sizeChanger = new SizeService(
    fireflies
  )

  const speed = new SpeedService(
    fireflies,
    speedConfig
  )

  const accelerate = new AccelerationService(
    fireflies,
    accelerationConfig
  )

  const drawer = new DrawService(
    canvas, fireflies
  )

  const eventHandler = new EventsService(
    fireflies,
    canvas
  )
  const app = new App(
    canvas,
    [sizeChanger, speed, accelerate, drawer, eventHandler]
  )

  app.run()
}