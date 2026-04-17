import { Shape } from "../enums";
import { ValueGeneratorWithFirefly } from "./genarator-callback.type";
import { WeightedValue } from "./possible-value.type";

type ComplexShapes = Shape.RegularPolygon | Shape.RegularPolygram

export type ShapeValue =  Exclude<Shape, ComplexShapes> | {
  shape: ComplexShapes,
  parameter: number
}

export type ShapeConfig = {
  value: ShapeValue | ShapeValue[] | ValueGeneratorWithFirefly<ShapeValue | ShapeValue[]> | WeightedValue<ShapeValue>[]
};
