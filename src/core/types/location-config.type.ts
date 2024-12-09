import { locationConfig } from "../configs";
import { LocationSetMethod } from "../enums";
import { Range } from "../models";
import { BaseConfig } from "./base-config.type";

type BaseLocationConfig =
  | {
    type: LocationSetMethod.Set,
    x: number | Range,
    y: number | Range,
  }
  | {
    type:
    | LocationSetMethod.Random
    | LocationSetMethod.CenterOfCanvas,
  }
  | {
    type:
    | LocationSetMethod.RandomX
    | LocationSetMethod.CenterX,
    y: number | Range,
  }
  | {
    type:
    | LocationSetMethod.RandomY
    | LocationSetMethod.CenterY,
    x: number | Range,
  }
  | {
    type: LocationSetMethod.FromXToCanvasWidth,
    x: number,
    y: number | Range,
  }
  | {
    type: LocationSetMethod.FromYToCanvasHeight,
    x: number | Range,
    y: number,
  }
  | {
    type: LocationSetMethod.FromXandYToCanvasSize,
    x: number,
    y: number,
  }
  | {
    type: LocationSetMethod.CanvasRelativeCallback,
    locationSetter: (canvasWidth: number, canvasHeight: number) => [
      x: number | Range,
      y: number | Range
    ]
  }

export type LocationConfig = BaseConfig & BaseLocationConfig;

