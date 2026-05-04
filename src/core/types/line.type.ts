import { FireflyArc, FireflyLine, InteractiveArc, InteractiveLine, SimpleArc, SimpleLine } from "../models";

export type Line = FireflyLine | InteractiveLine | SimpleLine;

export type Arc = FireflyArc | InteractiveArc | SimpleArc;

export type CartesianType<T> = {
  x: T;
  y: T;
}

export type CartersianCoordinates = {
  x: number;
  y: number
}