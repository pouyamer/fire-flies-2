import { App } from "./core";
import { accelerationConfig, alphaConfig, hueConfig, lightnessConfig, saturationConfig, sizeConfig, speedConfig } from "./core/configs";
import { Color, Firefly, FireflyCanvas } from "./core/models";
import { AccelerationService, ChangingValueService, DrawService, SpeedService } from "./core/services";

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

const fireflies = Array(1200).fill(0).map(_ => new Firefly({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  shape: "circle",
  key: Math.floor(
    Math.random() * 10000
  ) + "-" + Math.random() * 2000
})
)

if (canvas) {

  const speed = new SpeedService(
    speedConfig
  )

  const accelerate = new AccelerationService(
    accelerationConfig
  )

  const drawer = new DrawService(
    canvas
  )

  const sizeSetter = new ChangingValueService(
    "size",
    sizeConfig
  )

  const hue = new ChangingValueService(
    "hue",
    hueConfig
  )

  const saturation = new ChangingValueService(
    "saturation",
    saturationConfig,
  )

  const alpha = new ChangingValueService(
    "alpha",
    alphaConfig,
  )

  const lightness = new ChangingValueService(
    "lightness",
    lightnessConfig,
  );



  // const eventHandler = new EventsService(
  //   fireflies,
  //   canvas
  // )
  const app = new App(canvas, fireflies, [
    hue,
    saturation,
    lightness,
    alpha,
    sizeSetter,
    speed,
    accelerate,
    drawer
  ])

  app.run()
}