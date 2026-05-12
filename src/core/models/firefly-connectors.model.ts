import { CartersianCoordinates, ExtraArcConnectorConstructorModel, ExtraLineConnectorConstructorModel } from "../types";
import { calculateDistance, drawArcByCartesianCoordinates, drawLineByCartesianCoordinates, isFirefly } from "../utilities";
import { Firefly } from "./firefly.model";
import { InteractiveConnector } from "./interactive-connectors.model";

type ConstructorModel = {
  start: CartersianCoordinates | Firefly | (() => CartersianCoordinates);
  end: CartersianCoordinates | Firefly | (() => CartersianCoordinates);
  color?: string,
  lineWidth?: number,
}

type ArcConstructorModel = ConstructorModel & ExtraArcConnectorConstructorModel;

type LineConstructorModel = ConstructorModel & ExtraLineConnectorConstructorModel


export abstract class FireflyConnector extends InteractiveConnector {

  // if Firefly is used in start and / or end they'll be saved as Firefly as well
  startingFirefly?: Firefly;
  endingFirefly?: Firefly;

  constructor(model: ConstructorModel) {
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

  public get distance(): number {
    return calculateDistance(
      this.startingFirefly?.x ?? this.start.x,
      this.startingFirefly?.y ?? this.start.y,
      this.endingFirefly?.x ?? this.end.x,
      this.endingFirefly?.y ?? this.end.y,
    )
  }

}

export class FireflyLine extends FireflyConnector implements LineConstructorModel {
  extendStartBy: number = 0;
  extendEndBy: number = 0;
  
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

export class FireflyArc extends FireflyConnector implements ArcConstructorModel {
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