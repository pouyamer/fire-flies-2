import { DEFAULT_VALUE } from "../constants";
import { Direction } from "../types";
import { HslColor, RgbColor } from "./color.model";

export class FireflyCanvas {
  height: number;
  width: number;
  color: HslColor | RgbColor;
  hostElement: HTMLElement | null;
  canvasElement: HTMLCanvasElement;
  renderingContext2d: CanvasRenderingContext2D | null;
  leftBound: number | null;
  rightBound: number | null;
  topBound: number | null;
  bottomBound: number | null;
  mouseX: number | null;
  mouseY: number | null;

  constructor(model: Omit<Partial<FireflyCanvas>, "renderingContext"> = {}) {
    this.height = model.height ?? DEFAULT_VALUE.CanvasHeight;
    this.width = model.width ?? DEFAULT_VALUE.CanvasWidth;
    this.color = model.color ?? DEFAULT_VALUE.Color;
    this.hostElement = model.hostElement ?? null;
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.innerHTML = 'Your Browser doesn\'t support HTML Canvas :(';
    this.canvasElement.classList.add('canvas')
    if (this.hostElement) {
      this.hostElement.appendChild(this.canvasElement)
    }
    this.renderingContext2d = this.canvasElement.getContext('2d');
    this.leftBound = model.leftBound ?? null;
    this.rightBound = model.rightBound ?? null;
    this.topBound = model.topBound ?? null;
    this.bottomBound = model.bottomBound ?? null;
    this.mouseX = model.mouseX ?? null
    this.mouseY = model.mouseY ?? null


    this.setWidthAndHeight(this.width, this.height)
    this.setColor(this.color)
  }

  public setBounds(type: Direction, value: number | null): void {
    switch(type) {
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
    switch(type) {
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

    this.canvasElement.height = height;
    this.canvasElement.width = width;
  }

  public setColor(value: HslColor | RgbColor) {
    this.color = value;
    this.canvasElement.style.backgroundColor = value.toString();
  }
}