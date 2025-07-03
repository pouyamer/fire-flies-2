import { LocationConfig, PossibleValue, ValueGenerator } from "../types";

export class CONSTANTS {

  public static randomXCanvasWidth = this.createRandomValueBasedOnCanvasWidth();

  public static randomYCanvasHeight = this.createRandomValueBasedOnCanvasHeight();

  public static randomCanvasLocation = {
    x: this.randomXCanvasWidth,
    y: this.randomYCanvasHeight,
  }

  public static centerOfCanvas: LocationConfig = {
    x: ({canvas}) => canvas.width / 2,
    y: ({canvas}) => canvas.height / 2,
  }

  public static randomCanvasLocationWithSegments(
    xSegment?: number,
    ySegment?: number): {
    x: ValueGenerator<number | number[]>, 
    y: ValueGenerator<number | number[]>
  } {
    return {
      x: this.createRandomValueBasedOnCanvasWidth(xSegment),
      y: this.createRandomValueBasedOnCanvasHeight(ySegment),
    }
  }

  public static createRandomValueBasedOnCanvasWidth(segment?: number): ValueGenerator<number | number[]> {
    return ({canvas}) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((s, i) => i* canvas.width / Math.floor(segment))
        : []
      : Math.random() * canvas.width;
  }

  public static createRandomValueBasedOnCanvasHeight(segment?: number): ValueGenerator<number | number[]> {
    return ({canvas}) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((s, i) => i* canvas.height / Math.floor(segment))
        : []
      : Math.random() * canvas.height;
  }

}