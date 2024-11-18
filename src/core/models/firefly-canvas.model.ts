import { DEFAULT_VALUE, MESSAGE } from "../constants";
import { Utilities } from "../utilities";
import { Color } from "./color.model";

export class FireflyCanvas {
  height: number;
  width: number;
  color: Color;
  viewElement: HTMLCanvasElement | null;
  renderingContext: CanvasRenderingContext2D | null;
  leftBound: number | null;
  rightBound: number | null;
  topBound: number | null;
  bottomBound: number | null;

  constructor(model: Omit<Partial<FireflyCanvas>, "renderingContext"> = {}) {
    this.height = model.height ?? DEFAULT_VALUE.CanvasHeight;
    this.width = model.width ?? DEFAULT_VALUE.CanvasWidth;
    this.color = model.color ?? DEFAULT_VALUE.Color;
    this.viewElement = model.viewElement ?? null;
    if (!model.viewElement) console.warn(MESSAGE.CanvasElementDoesNotExist);
    this.renderingContext = model.viewElement?.getContext("2d") ?? null;
    if (!this.renderingContext) console.warn(MESSAGE.CanvasRenderingContextDoesNotExist)
    this.leftBound = model.leftBound ?? null;
    this.rightBound = model.rightBound ?? null;
    this.topBound = model.topBound ?? null;
    this.bottomBound = model.bottomBound ?? null;


    this.setWidthAndHeight(this.width, this.height)
    this.setColor(this.color)
  }

  public setWidthAndHeight(
    width: number,
    height: number
  ): void {
    this.height = height;
    this.width = width;

    if (this.viewElement) {
      this.viewElement.height = height;
      this.viewElement.width = width;
    }
  }

  public setColor(value: Color) {
    this.color = value;
    if (this.viewElement) {
      this.viewElement.style.backgroundColor = Utilities.hslColorToString(value)
    }
  }
}