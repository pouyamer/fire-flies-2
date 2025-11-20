import { ValueGenerator } from "./genarator-callback.type";
import { PossibleValue } from "./possible-value.type";

type StrokeValue = {
  value: 'stroke',
  lineWidth: PossibleValue<number>
}

export type DrawConfig = {
  // default value: 1
  iterationPerFrame: number;
  clearBeforeDrawing: boolean;
  method: StrokeValue | 'fill' | ValueGenerator<StrokeValue | 'fill'>;
  // strokeLineWidth: PossibleValue<number>
}