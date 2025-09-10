import { FireflyApp } from "../app";
import { ServiceName, Shape } from "../enums";
import { Service } from "../interfaces";
import { Color, Firefly, FireflyCanvas } from "../models";
import { DrawConfig } from "../types";
import { Utilities } from "../utilities";

export class DrawService
  implements Service {

  name = ServiceName.Draw;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: DrawConfig,
    private readonly app: FireflyApp
  ) {
  }

  private drawFirefly(
    firefly: Firefly,
    ctx: CanvasRenderingContext2D,
  ): void {

    const { x, y, size } = firefly;

    if (typeof firefly.shapeValue === "string") {
      switch(firefly.shapeValue) {
        case Shape.Circle:
          ctx.beginPath()
          ctx.arc(x, y, size.value, 0, 2 * Math.PI)
          ctx.moveTo(x, y)
          firefly.drawMethod === "stroke" ? ctx.stroke() : ctx.fill()
          break;

        case Shape.Square:
          ctx.fillRect(x, y, size.value, size.value);
          firefly.drawMethod === "stroke" 
            ? ctx.strokeRect(x, y, size.value, size.value)
            : ctx.fillRect(x, y, size.value, size.value)
          break;
        case Shape.QuarterCircle:
          break;
      }
    }
    else {
      switch(firefly.shapeValue.shape) {
      case Shape.RegularPolygram:
        const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + firefly.rotatedAngle

        const innerRadius = firefly.size.value / 2
        const outerRadius = firefly.size.value

        ctx.beginPath()
        for (let i = 0; i < firefly.shapeValue.parameter; i++) {
          let dx = outerRadius * Math.cos((i * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          let dy = outerRadius * Math.sin((i * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          let outerX = x + dx
          let outerY = y + dy

          dx = innerRadius * Math.cos(((i + 0.5) * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          dy = innerRadius * Math.sin(((i + 0.5) * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          let innerX = x + dx
          let innerY = y + dy

          ctx.lineTo(outerX, outerY)
          ctx.lineTo(innerX, innerY)
        }

        firefly.drawMethod === "stroke" ? ctx.stroke() : ctx.fill()

        break;
      case Shape.RegularPolygon:
        const halfSize = firefly.size.value

        ctx.beginPath()
        for (let i = 0; i < firefly.shapeValue.parameter; i++) {
          const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + firefly.rotatedAngle
          let dx = halfSize * Math.cos((i * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          let dy = halfSize * Math.sin((i * 2 * Math.PI) / firefly.shapeValue.parameter + angle)
          let outerX = x + +dx
          let outerY = y + dy
          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }
        }
        ctx.closePath()
        firefly.drawMethod === "stroke" ? ctx.stroke() : ctx.fill()
        break;
      }
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

    const method = typeof this.config.method === "string" ? this.config.method : this.config.method({
      app: this.app,
      canvas: this.canvas,
      currentFirefly: firefly,
      fireflies: this.fireflies
    });

    firefly.drawMethod = method;
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const { renderingContext: ctx } = this.canvas

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === ServiceName.Draw
    )

    if (ctx && serviceExists) {

      const style = Utilities.hslColorToString(new Color({
        hue: firefly.hue.value,
        saturation: firefly.saturation.value,
        lightness: firefly.lightness.value,
        alpha: firefly.alpha.value,
      }));

      firefly.drawMethod === "fill" 
        ? ctx.fillStyle = style
        : ctx.strokeStyle = style
      
      this.drawFirefly(firefly, ctx)
    }
  }

  public onFramePass(): void {
    if (this.config.clearBeforeDrawing) {
      this.canvas.renderingContext?.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    for(let i = 0; i < this.config.iterationPerFrame; i++) {
      for (let ff of this.fireflies) {
        this.onFramePassForSingleFirefly(ff);
      }
    }
  }

}