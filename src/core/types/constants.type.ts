import { HslColor, RgbColor } from "../models";

type MessageKeys =
  | "CanvasElementDoesNotExist"
  | "CanvasRenderingContextDoesNotExist"

export type Message = {
  [key in MessageKeys]: string;
};

export type DefaultValue = {
  Color: HslColor | RgbColor,
  CanvasHeight: number,
  CanvasWidth: number,
}