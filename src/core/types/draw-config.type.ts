import { ValueGenerator } from "./genarator-callback.type";

export type DrawConfig = {
  // default value: 1
  iterationPerFrame: number;
  clearBeforeDrawing: boolean;
  method: 'stroke' | 'fill' | ValueGenerator<'stroke' | 'fill'>;
}