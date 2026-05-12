import { Boundary } from "../models";
import { EventCallBackWithFirefly } from "./event-callback.type";
import { CartesianType } from "./line.type";

// type BoundsConfigEvent = (Partial<DirectionalTyped<EventCallBackWithFirefly>> & {all?: EventCallBackWithFirefly}) |
//   EventCallBackWithFirefly

// export type Direction = 'top' | 'bottom' | 'left' | 'right'


//   Partial<DirectionalTyped<number | GeneratorValueOnCanvasCallback<number>>> &
// {
//   // when ON it corrects the offset of position of firefly when it goes out of bounds due to frames
//   // note that when this is on outofbounds never gets triggered for that direction
//   applyPositionCorrection?: Partial<DirectionalTyped<boolean>>;
//   onFireflyOutOfBounds?: BoundsConfigEvent;
//   onFireflyTouchedBounds?: BoundsConfigEvent;

// }

export type BoundaryRuleParameters = {
  xPlusHalfSize: number,
  xMinusHalfSize: number,
  yPlusHalfSize: number,
  yMinusHalfSize: number,
  canvasHeight: number,
  canvasWidth: number;
  size: number
}

export type BoundaryRule = ((parameters: BoundaryRuleParameters) => boolean) | false;

export type BoundaryRules = {
    out: BoundaryRule;
    touched: BoundaryRule;
  };

export type BoundaryConfig = {
  key: string;
  rules: BoundaryRules
  onOut?: EventCallBackWithFirefly;
  onTouched?: EventCallBackWithFirefly;
  touchedPositionCorrector?: EventCallBackWithFirefly
}


export type BoundaryControlConfig = {
  boundaries: BoundaryConfig[]
};