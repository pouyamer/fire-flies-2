import { Color } from "../models";

type MessageKeys =
  | "CanvasElementDoesNotExist"
  | "CanvasRenderingContextDoesNotExist"

export type Message = {
  [key in MessageKeys]: string;
};

export type DefaultValue = {
  Color: Color,
  CanvasHeight: number,
  CanvasWidth: number,
}