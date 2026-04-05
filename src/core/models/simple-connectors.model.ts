import { DEFAULT_COORDINATES } from "../constants";
import { CartersianCoordinates } from "../types";
import { calculateDistance, drawLineByCartesianCoordinates } from "../utilities";

export abstract class SimpleConnector {
  private _start: CartersianCoordinates;
  private _end: CartersianCoordinates;
  color: string;
  lineWidth: number;

  constructor(model: {
    start?: CartersianCoordinates;
    end?: CartersianCoordinates;
    color?: string;
    lineWidth?: number;
  }) {
    this._start = model.start ?? DEFAULT_COORDINATES;
    this._end = model.end ?? DEFAULT_COORDINATES;
    this.color = model.color ?? 'white';
    this.lineWidth = model.lineWidth ?? 1;
  }

  public get start(): CartersianCoordinates {
    return this._start;
  }

  public get end(): CartersianCoordinates {
    return this._end;
  }

  public get distance(): number {
    return calculateDistance(
      this.start.x,
      this.start.y,
      this.end.x,
      this.end.y
    )
  }
}


export class SimpleLine extends SimpleConnector {

  constructor(model: {
    start?: CartersianCoordinates;
    end?: CartersianCoordinates;
    color?: string;
    lineWidth?: number;
  }) {
    super(model)
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawLineByCartesianCoordinates(ctx, this.start, this.end, this.color, this.lineWidth);
  }
}

export class SimpleArc extends SimpleConnector {
  constructor(model: {
    start?: CartersianCoordinates;
    end?: CartersianCoordinates;
    color?: string;
    lineWidth?: number;
  }) {
    super(model)
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawLineByCartesianCoordinates(ctx, this.start, this.end, this.color, this.lineWidth);
  }
}