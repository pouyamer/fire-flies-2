import { HslColor, RgbColor } from "../models";

type MessageKeys =
  | "CanvasElementDoesNotExist"
  | "CanvasRenderingContextDoesNotExist"

export type Message = {
  [key in MessageKeys]: string;
};

export type DefaultValue = {
  CanvasHeight: number,
  CanvasWidth: number,
  Color: HslColor
}