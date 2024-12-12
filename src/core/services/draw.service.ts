import { ServiceName, Shape } from "../enums";
import { Service } from "../interfaces";
import { Color, Firefly, FireflyCanvas } from "../models";
import { Utilities } from "../utilities";

export class DrawService
  implements Service {

  name = ServiceName.Draw;

  constructor(
    private readonly fireflyCanvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
  ) {
  }

  private drawFirefly(
    firefly: Firefly,
    ctx: CanvasRenderingContext2D
  ): void {

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
      case Shape.RegularPolygram:
        const angle = ((firefly.pointCount - 2) * Math.PI) / (2 * firefly.pointCount)

        const innerRadius = firefly.size.value / 2
        const outerRadius = firefly.size.value

        ctx.beginPath()
        for (let i = 0; i < firefly.pointCount; i++) {
          let dx = outerRadius * Math.cos((i * 2 * Math.PI) / firefly.pointCount + angle)
          let dy = outerRadius * Math.sin((i * 2 * Math.PI) / firefly.pointCount + angle)
          let outerX = x + dx
          let outerY = y + dy

          dx = innerRadius * Math.cos(((i + 0.5) * 2 * Math.PI) / firefly.pointCount + angle)
          dy = innerRadius * Math.sin(((i + 0.5) * 2 * Math.PI) / firefly.pointCount + angle)
          let innerX = x + dx
          let innerY = y + dy

          ctx.lineTo(outerX, outerY)
          ctx.lineTo(innerX, innerY)
        }
        ctx.fill()

        break;
      case Shape.RegularPolygon:
        const halfSize = firefly.size.value

        ctx.beginPath()
        for (let i = 0; i < firefly.sideCount; i++) {
          const angle = ((firefly.sideCount - 2) * Math.PI) / (2 * firefly.sideCount)
          let dx = halfSize * Math.cos((i * 2 * Math.PI) / firefly.sideCount + angle)
          let dy = halfSize * Math.sin((i * 2 * Math.PI) / firefly.sideCount + angle)
          let outerX = x + +dx
          let outerY = y + dy
          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }
        }
        ctx.closePath()
        ctx.fill()
        break;
      case Shape.QuarterCircle:
        break;
    }
  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const { renderingContext: ctx } = this.fireflyCanvas

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === ServiceName.Draw
    )

    if (ctx && serviceExists) {
      ctx.fillStyle = Utilities.hslColorToString(new Color({
        hue: firefly.hue.value,
        saturation: firefly.saturation.value,
        lightness: firefly.lightness.value,
        alpha: firefly.alpha.value,
      }));
      this.drawFirefly(firefly, ctx)
    }
  }


  public onFramePass(): void {
      for (let ff of this.fireflies) {
        this.onFramePassForSingleFirefly(ff);
      }
  }

}