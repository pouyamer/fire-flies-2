import { CartersianCoordinates, ExtraArcConnectorConstructorModel, ExtraLineConnectorConstructorModel } from "../types";
import { calculateDistance, drawArcByCartesianCoordinates, drawLineByCartesianCoordinates } from "../utilities";
import { SimpleConnector } from "./simple-connectors.model";

interface ConstructorModel {
  start: CartersianCoordinates | (() => CartersianCoordinates);
  end: CartersianCoordinates | (() => CartersianCoordinates);
  color?: string;
  lineWidth?: number;
};


type ArcConstructorModel = ConstructorModel & ExtraArcConnectorConstructorModel;

type LineConstructorModel = ConstructorModel & ExtraLineConnectorConstructorModel;

export abstract class InteractiveConnector extends SimpleConnector {
  private _startValueOrCallback: CartersianCoordinates | (() => CartersianCoordinates);
  private _endValueOrCallback: CartersianCoordinates | (() => CartersianCoordinates);

  constructor(model: ConstructorModel) {

    super({
      start: typeof model.start === 'function' ? model.start() : model.start,
      end: typeof model.end === 'function' ? model.end() : model.end,
      color: model.color,
      lineWidth: model.lineWidth,
    })

    this._startValueOrCallback = model.start;
    this._endValueOrCallback = model.end;

  }

  public get start(): CartersianCoordinates {
    return typeof this._startValueOrCallback === 'function' ? this._startValueOrCallback() : this._startValueOrCallback
  }

  public get end(): CartersianCoordinates {
    return typeof this._endValueOrCallback === 'function' ? this._endValueOrCallback() : this._endValueOrCallback
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

export class InteractiveLine extends InteractiveConnector implements LineConstructorModel {

  extendStartBy: number;
  extendEndBy: number;

  constructor(model: LineConstructorModel) {
    super(model);
    this.extendStartBy = model.extendStartBy ?? 0;
this.extendEndBy = model.extendEndBy ?? 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawLineByCartesianCoordinates(
      ctx,
      this.start,
      this.end,
      this.extendStartBy,
      this.extendEndBy,
      this.color,
      this.lineWidth,
    )
  }

}
export class InteractiveArc extends InteractiveConnector implements ArcConstructorModel {

  perpendicularOffset: number;
  counterClockWise: boolean;

  constructor(model: ArcConstructorModel) {
    super(model);
    this.perpendicularOffset = model.perpendicularOffset ?? 0;
    this.counterClockWise = model.counterClockWise ?? false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawArcByCartesianCoordinates(
      ctx,
      this.start,
      this.end,
      this.perpendicularOffset,
      this.counterClockWise,
      this.color,
      this.lineWidth,
    )
  }
}