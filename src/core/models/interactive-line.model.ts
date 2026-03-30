import { Utilities } from "../utilities";
import { Firefly } from "./firefly.model";

type CartersianCoordinates = {
  x: number;
  y: number
}

function isFirefly(
  value: Firefly | CartersianCoordinates | (() => CartersianCoordinates),
): value is Firefly {
  return typeof value === 'object' && !Array.isArray(value) && ("key" in value);
}

const DEFAULT_COORDINATES = {
  x: 0,
  y: 0,
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: CartersianCoordinates,
  end: CartersianCoordinates,
  color: string,
  lineWidth: number
): void {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke();
}

export class SimpleLine {
  private _start: CartersianCoordinates;
  private _end: CartersianCoordinates;
  color: string;
  lineWidth: number;

  constructor(model: {
    start: CartersianCoordinates;
    end: CartersianCoordinates;
    color?: string;
    lineWidth?: number;
  }) {
    this._start = model.start ?? DEFAULT_COORDINATES;
    this._end = model.end ?? DEFAULT_COORDINATES;
    this.color = model.color ?? 'white';
    this.lineWidth = model.lineWidth ?? 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawLine(ctx, this._start, this._end, this.color, this.lineWidth);
  }

  public get start(): CartersianCoordinates {
    return this._start;
  }

  public get end(): CartersianCoordinates {
    return this._end;
  }

  public get length(): number {
    return Utilities.calculateDistance(
      this._start.x,
      this._start.y,
      this._end.x,
      this._end.y
    )
  }

}

export class InteractiveLine extends SimpleLine {

  private _startValueOrCallback: CartersianCoordinates | (() => CartersianCoordinates);
  private _endValueOrCallback: CartersianCoordinates | (() => CartersianCoordinates);

  constructor(model: {
    start: CartersianCoordinates | (() => CartersianCoordinates);
    end: CartersianCoordinates | (() => CartersianCoordinates);
    color?: string;
    lineWidth?: number
  }) {

    super({
      start: typeof model.start === 'function' ? model.start() : model.start,
      end: typeof model.end === 'function' ? model.end() : model.end,
      color: model.color,
      lineWidth: model.lineWidth,
    })

    this._startValueOrCallback = model.start;
    this._endValueOrCallback = model.end;

  }

  override draw(ctx: CanvasRenderingContext2D): void {
    drawLine(
      ctx,
      typeof this._startValueOrCallback === 'function' ? this._startValueOrCallback() : this._startValueOrCallback,
      typeof this._endValueOrCallback === 'function' ? this._endValueOrCallback() : this._endValueOrCallback,
      this.color,
      this.lineWidth,
    )
  }

  public get start(): CartersianCoordinates {
    return typeof this._startValueOrCallback === 'function' ? this._startValueOrCallback() : this._startValueOrCallback
  }

  public get end(): CartersianCoordinates {
    return typeof this._endValueOrCallback === 'function' ? this._endValueOrCallback() : this._endValueOrCallback
  }

  public get length(): number {

    return Utilities.calculateDistance(
      this.start.x,
      this.start.y,
      this.end.x,
      this.end.y
    )
  }

}

export class FireflyConnectorLine extends InteractiveLine {

  // if Firefly is used in start and / or end they'll be saved as Firefly as well
  startingFirefly?: Firefly;
  endingFirefly?: Firefly;

  constructor(model: {
    start: CartersianCoordinates | Firefly | (() => CartersianCoordinates);
    end: CartersianCoordinates | Firefly | (() => CartersianCoordinates);
    color?: string,
    lineWidth?: number,
  }) {
    const { start, end } = model;
    
    super({
      start: isFirefly(start) ? (() => start) : start,
      end: isFirefly(end) ? (() => end) : end,
      color: model.color,
      lineWidth: model.lineWidth
    })

    this.startingFirefly = isFirefly(model.start) ? model.start : undefined;
    this.endingFirefly = isFirefly(model.end) ? model.end : undefined;
  }

  public get length(): number {

    return Utilities.calculateDistance(
      this.startingFirefly?.x ?? this.start.x,
      this.startingFirefly?.y ?? this.start.y,
      this.endingFirefly?.x ?? this.end.x,
      this.endingFirefly?.y ?? this.end.y,
    )
  }
}