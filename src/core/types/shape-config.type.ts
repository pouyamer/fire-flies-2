import { Shape, ShapeSetMethod } from "../enums"
import { Firefly, FireflyCanvas, Range } from "../models"
import { PossibleValue } from "./possible-value.type";
export type ShapeConfig =
  | SingleShapeConfig
  | RandomShapeConfig
  | CallbackShapeConfig;

export type ShapeValue = BasicShapeValue | PolygonValue | PolygramValue

type BaseSingleShapeConfig = {
  setMethod: ShapeSetMethod.SingleShape;
};

type BasicShapeValue = {
  value: Shape.Circle | Shape.Square | Shape.QuarterCircle;
}

type PolygonValue = {
  value: Shape.RegularPolygon;
  sideCount: PossibleValue<number>;
}

type PolygramValue = {
  value: Shape.RegularPolygram;
  pointCount: PossibleValue<number>;
}

type BasicShapeConfig = BaseSingleShapeConfig & BasicShapeValue;

// Configuration for regular polygons
type PolygonConfig = BaseSingleShapeConfig & PolygonValue;

// Configuration for regular polygrams
type PolygramConfig = BaseSingleShapeConfig & PolygramValue;

// Single shape configurations
type SingleShapeConfig =
  | BasicShapeConfig
  | PolygonConfig
  | PolygramConfig;

// Random shape configuration
type RandomShapeConfig = {
  setMethod: ShapeSetMethod.Random;
  values: ShapeValue[]
};

// Callback shape configuration
type CallbackShapeConfig = {
  setMethod: ShapeSetMethod.ShapeSetterCallback;
  shapeSetter: (
    firefly?: Firefly,
    canvas?: FireflyCanvas
  ) => ShapeValue[]
  ;
};

// Helper type for complex shape configurations
type ComplexShapeConfig =
  | {
    value: Shape.RegularPolygon;
    sideCount: PossibleValue<number>;
  }
  | {
    value: Shape.RegularPolygram;
    pointCount: PossibleValue<number>;
  };