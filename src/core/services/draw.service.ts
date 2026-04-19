import { Shape } from "../enums";
import { Mutator, Ownable } from "../interfaces";
import { ChangingNumericalValueItem, Firefly, FireflyServiceToggleKeyRequiringFirefly, HslColor, RgbColor } from "../models";
import { FireflyTrail } from "../models/firefly-trail.model";
import { DrawConfig, FireflyAppApiGetter, PossibleValue } from "../types";
import { getNumericValue, getTrailOrFireflyValue, isRange } from "../utilities";

export class DrawService
  implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'draw';

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
    firefly: Firefly | FireflyTrail,
    ctx: CanvasRenderingContext2D,
  ): void {

    const style = this.appApi('configs').general.colorMode === 'HSL'
      ? new HslColor({
        hue: getTrailOrFireflyValue(firefly.hue),
        saturation: getTrailOrFireflyValue(firefly.saturation),
        lightness: getTrailOrFireflyValue(firefly.lightness),
        alpha: getTrailOrFireflyValue(firefly.alpha),
      }).toString()
      : new RgbColor({
        red: getTrailOrFireflyValue(firefly.red),
        green: getTrailOrFireflyValue(firefly.green),
        blue: getTrailOrFireflyValue(firefly.blue),
        alpha: getTrailOrFireflyValue(firefly.alpha),
      }).toString();

    ctx.lineWidth = firefly.strokeLineWidth;
    firefly.drawMethod === "fill"
      ? ctx.fillStyle = style
      : ctx.strokeStyle = style

    const { x, y } = firefly;

    const size = getTrailOrFireflyValue(firefly.size)
    const rotation = getTrailOrFireflyValue(firefly.rotation);


    if (typeof firefly.shapeValue === "string") {
      switch (firefly.shapeValue) {
        case Shape.Circle:
          ctx.beginPath()
          ctx.arc(x, y, size, 0, 2 * Math.PI)
          ctx.moveTo(x, y)
          firefly.drawMethod === "stroke" ? ctx.stroke() : ctx.fill()
          break;

        case Shape.Square:
          ctx.fillRect(x, y, size, size);
          firefly.drawMethod === "stroke"
            ? ctx.strokeRect(x, y, size, size)
            : ctx.fillRect(x, y, size, size)
          break;
        case Shape.QuarterCircle:
          break;
      }
    }
    else {
      switch (firefly.shapeValue.shape) {
        case Shape.RegularPolygram:
          const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + rotation

          const innerRadius = size / 2
          const outerRadius = size

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
          const halfSize = size

          ctx.beginPath();

          for (let i = 0; i < firefly.shapeValue.parameter; i++) {
            const angle = ((firefly.shapeValue.parameter - 2) * Math.PI) / (2 * firefly.shapeValue.parameter) + rotation
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

  add(firefly: Firefly): void {
    if (!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if (this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }

  public set(): void {


    for (let ff of this.fireflies) {
      this.setOne(ff);
    }
  }

  public setOne(firefly: Firefly): void {

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

  public updateOne(firefly: Firefly): void {
    const { renderingContext2d: ctx } = this.appApi('canvas');

    if (ctx) {

      firefly.trails.forEach(
        trail => {
          this.drawFirefly(trail as any, ctx)
        }
      )

      this.drawFirefly(firefly, ctx)
    }
  }

  public update(): void {
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
        this.updateOne(ff);
      }
    }
  }

}