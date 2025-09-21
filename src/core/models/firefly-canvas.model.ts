import { DEFAULT_VALUE, MESSAGE } from "../constants";
import { Utilities } from "../utilities";
import { Color } from "./color.model";

export class FireflyCanvas {
  height: number;
  width: number;
  color: Color;
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

  public setWidthAndHeight(
    width: number,
    height: number
  ): void {
    this.height = height;
    this.width = width;

    this.canvasElement.height = height;
    this.canvasElement.width = width;
  }

  public setColor(value: Color) {
    this.color = value;
    this.canvasElement.style.backgroundColor = Utilities.hslColorToString(value)
  }
}