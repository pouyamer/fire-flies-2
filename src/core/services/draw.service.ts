import { Shape } from "../enums";
import { Service } from "../interfaces";
import { Firefly, HslColor, RgbColor } from "../models";
import { DrawConfig, FireflyAppApiGetter, PossibleValue } from "../types";
import { getNumericValue, isRange } from "../utilities";

export class DrawService
  implements Service {

  private fireflies: Firefly[] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: DrawConfig,
  ) {
  }

  private getValue(firefly: Firefly, value: PossibleValue<number>) {
    if (
      isRange(value) ||
      typeof value === "number" ||
      Array.isArray(value)
    ) {
      return getNumericValue(value);
    }
    else {
      return getNumericValue(value({
        firefly,
        api: this.appApi
      }));
    }
  }

  private drawFirefly(
    firefly: Firefly,
    ctx: CanvasRenderingContext2D,
  ): void {

    const { x, y, size } = firefly;


    if (typeof firefly.shapeValue === "string") {
      switch (firefly.shapeValue) {
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
      switch (firefly.shapeValue.shape) {
        case Shape.RegularPolygram:
          const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + firefly.rotation.value

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

          ctx.beginPath();

          for (let i = 0; i < firefly.shapeValue.parameter; i++) {
            const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + firefly.rotation.value
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
  
  public addFirefly(firefly: Firefly): void {
    this.fireflies.push(firefly);
  }

  public setOnEveryFirefly(): void {


    for (let ff of this.fireflies) {
      this.setOnSingleFirefly(ff);
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {

    const [drawMethod, strokeLineWidth] = ((): [('fill' | 'stroke'), number] => {
      this.config.method

      if (this.config.method === 'fill') {
        return ['fill', 0];
      }

      if (typeof this.config.method === 'function') {
        const valueFromFunction = this.config.method({
          firefly,
          api: this.appApi,
        })

        return valueFromFunction === 'fill' ? ['fill', 0] : ['stroke', this.getValue(firefly, valueFromFunction.lineWidth)]
      }

      return ['stroke', this.getValue(firefly, this.config.method.lineWidth)]
    })()

    firefly.drawMethod = drawMethod
    firefly.strokeLineWidth = strokeLineWidth
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const { renderingContext2d: ctx } = this.appApi('canvas');

    if (ctx) {

      const style = this.appApi('app').generalConfig.colorMode === 'HSL'
        ? new HslColor({
          hue: firefly.hue.value,
          saturation: firefly.saturation.value,
          lightness: firefly.lightness.value,
          alpha: firefly.alpha.value,
        }).toString()
        : new RgbColor({
          red: firefly.red.value,
          green: firefly.green.value,
          blue: firefly.blue.value,
          alpha: firefly.alpha.value,
        }).toString();

      ctx.lineWidth = firefly.strokeLineWidth;
      firefly.drawMethod === "fill"
        ? ctx.fillStyle = style
        : ctx.strokeStyle = style

      this.drawFirefly(firefly, ctx)
    }
  }

  public onFramePass(): void {
    const ctx = this.appApi('canvas').renderingContext2d;

    if (!ctx) return;

    if (this.config.clearBeforeDrawing) {
      ctx.clearRect(0, 0, this.appApi('canvas').width, this.appApi('canvas').height)
    }

    if (this.appApi('lines').length) {
      this.appApi('lines').forEach(line => {
        line.draw(ctx)
      });
    }

    if (this.appApi('arcs').length) {
      this.appApi('arcs').forEach(arc => {
        arc.draw(ctx)
      });
    }

    for (let i = 0; i < this.config.iterationPerFrame; i++) {
      for (let ff of this.fireflies) {
        ff.serviceToggle.get('draw') && this.onFramePassForSingleFirefly(ff);
      }
    }
  }

}