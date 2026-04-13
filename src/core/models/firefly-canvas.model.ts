import { DEFAULT_VALUE } from "../constants";
import { Direction, HslWithoutAlpha, RgbWithoutAlpha } from "../types";
import { HslColor, RgbColor } from "./color.model";

type CanvasColor = ({ type: 'hsl' } & HslWithoutAlpha<number>) | ({ type: 'rgb' } & RgbWithoutAlpha<number>);

export type IFireflyCanvasProps = {
  color?: CanvasColor;
  hostElement: HTMLElement | null;
  height?: number;
  width?: number;
}

export class FireflyCanvas {
  private _hostElement: HTMLElement | null;
  private _canvasElement = document.createElement('canvas');
  private _renderingContext2d: CanvasRenderingContext2D | null;

  height: number;
  width: number;
  color: RgbColor | HslColor;
  leftBound: number | null = null;
  rightBound: number | null = null;
  topBound: number | null = null;
  bottomBound: number | null = null;
  mouseX: number | null = null;
  mouseY: number | null = null;

  constructor(model: IFireflyCanvasProps) {
    this.height = model.height ?? DEFAULT_VALUE.CanvasHeight;
    this.width = model.width ?? DEFAULT_VALUE.CanvasWidth;
    this.color = this.getColorByModel(model.color);
    this._hostElement = model.hostElement ?? null;
    this._canvasElement.innerHTML = 'Your Browser doesn\'t support HTML Canvas :(';
    this._canvasElement.classList.add('canvas')
    this._hostElement?.appendChild(this._canvasElement)
    this._renderingContext2d = this._canvasElement.getContext('2d');


    this.setWidthAndHeight(this.width, this.height)
    this.setColor(this.color);
  }

  private getColorByModel(color: IFireflyCanvasProps['color']): HslColor | RgbColor {
    if (!color) {
      return DEFAULT_VALUE.Color;
    }

    const { alpha } = color;

    switch (color.type) {
      case "rgb":
        const { red, green, blue } = color;
        return new RgbColor({ red, green, blue, alpha });
      case "hsl":
        const { hue, saturation, lightness } = color;
        return new HslColor({ hue, saturation, lightness, alpha });
    }
  }

  public get renderingContext2d(): CanvasRenderingContext2D | null {
    return this._renderingContext2d;
  }

  public setBounds(type: Direction, value: number | null): void {
    switch (type) {
      case "top":
        this.topBound = value;
      case "bottom":
        this.bottomBound = value;
      case "left":
        this.leftBound = value;
      case "right":
        this.rightBound = value;
    }
  }

  public getBounds(type: Direction): number | null {
    switch (type) {
      case "top":
        return this.topBound;
      case "bottom":
        return this.bottomBound;
      case "left":
        return this.leftBound;
      case "right":
        return this.rightBound;
    }
  }

  public setWidthAndHeight(
    width: number,
    height: number
  ): void {
    this.height = height;
    this.width = width;

    this._canvasElement.height = height;
    this._canvasElement.width = width;
  }

  public setColor(value: HslColor | RgbColor) {
    this.color = value;
    this._canvasElement.style.backgroundColor = value.toString();
  }
}