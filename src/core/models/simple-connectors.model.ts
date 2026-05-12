import { DEFAULT_COORDINATES } from "../constants";
import { CartersianCoordinates, ExtraArcConnectorConstructorModel, ExtraLineConnectorConstructorModel } from "../types";
import { calculateDistance, drawArcByCartesianCoordinates, drawLineByCartesianCoordinates } from "../utilities";

type ConstructorModel = {
  start?: CartersianCoordinates;
  end?: CartersianCoordinates;
  color?: string;
  lineWidth?: number;
};


type ArcConstructorModel = ConstructorModel & ExtraArcConnectorConstructorModel;

type LineConstructorModel = ConstructorModel & ExtraLineConnectorConstructorModel;

export abstract class SimpleConnector {
  private _start: CartersianCoordinates;
  private _end: CartersianCoordinates;
  color: string;
  lineWidth: number;

  constructor(model: ConstructorModel) {
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


export class SimpleLine extends SimpleConnector implements LineConstructorModel {
  extendStartBy: number = 0;
  extendEndBy: number = 0;


  constructor(model: LineConstructorModel) {
    super(model);
    this.extendStartBy = model.extendStartBy ?? 0;
    this.extendEndBy = model.extendEndBy ?? 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawLineByCartesianCoordinates(
      ctx,
      this.start,
      this.end,
      this.extendStartBy,
      this.extendEndBy,
      this.color,
      this.lineWidth
    );
  }
}

export class SimpleArc extends SimpleConnector implements ArcConstructorModel {

  perpendicularOffset: number = 0;
  counterClockWise: boolean = false;

  constructor(model: ArcConstructorModel) {
    super(model);
    this.perpendicularOffset = model.perpendicularOffset ?? 0;
    this.counterClockWise = model.counterClockWise ?? false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawArcByCartesianCoordinates(
      ctx,
      this.start,
      this.end,
      this.perpendicularOffset,
      this.counterClockWise,
      this.color,
      this.lineWidth
    );
  }
}