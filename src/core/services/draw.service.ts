import { Service } from "../interfaces";
import { Color, Firefly, FireflyCanvas } from "../models";
import { Utilities } from "../utilities";

export class DrawService
  implements Service {
  fireflyCanvas: FireflyCanvas;


  constructor(
    fireflyCanvas: FireflyCanvas,
  ) {
    this.fireflyCanvas = fireflyCanvas;
  }

  private drawFirefly(firefly: Firefly, ctx: CanvasRenderingContext2D): void {
    const { x, y, size } = firefly;
    switch (firefly.shape) {
      case "circle":
        ctx.beginPath()
        ctx.arc(x, y, size.value, 0, 2 * Math.PI)
        ctx.moveTo(x, y)
        ctx.fill()
        break;
      case "square":
        ctx.fillRect(x, y, size.value, size.value);
        break;
      case "regularPolygon":
        break;
      case "regularPolygram":
        break;
      case "quarterCircle":
        break;
    }
  }

  public set(firefly: Firefly): void {

  }

  public execute(firefly: Firefly): void {
    const { renderingContext: ctx } = this.fireflyCanvas
    if (ctx) {

      ctx.fillStyle = Utilities.hslColorToString(new Color({
        hue: firefly.hue.value,
        saturation: firefly.saturation.value,
        lightness: firefly.lightness.value,
        alpha: firefly.alpha.value,
      }));
      this.drawFirefly(firefly, ctx)

    }
  }
}