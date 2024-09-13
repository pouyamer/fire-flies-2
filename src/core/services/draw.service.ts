import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { Utilities } from "../utilities";

export class DrawService
  implements Service {
  fireflyCanvas: FireflyCanvas;
  fireflies: Firefly[];


  constructor(
    fireflyCanvas: FireflyCanvas,
    fireflies: Firefly[]
  ) {
    this.fireflyCanvas = fireflyCanvas;
    this.fireflies = fireflies;
  }

  private drawFirefly(firefly: Firefly, ctx: CanvasRenderingContext2D): void {
    const { x, y, size } = firefly;
    switch (firefly.shape) {
      case "circle":
        ctx.beginPath()
        ctx.arc(x, y, size, 0, 2 * Math.PI)
        ctx.moveTo(x, y)
        ctx.fill()
        break;
      case "square":
        ctx.fillRect(x, y, size, size);
        break;
      case "regularPolygon":
        break;
      case "regularPolygram":
        break;
      case "quarterCircle":
        break;
    }
  }

  public execute = (): void => {
    const { renderingContext: ctx } = this.fireflyCanvas
    if (ctx) {
      ctx.clearRect(0, 0, this.fireflyCanvas.width, this.fireflyCanvas.height)
      this.fireflies.forEach(
        firefly => {
          ctx.fillStyle = Utilities.hslColorToString(firefly.color);
          this.drawFirefly(firefly, ctx)
        }

      )
    }
  }
}