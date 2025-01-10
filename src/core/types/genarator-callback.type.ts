import { FireflyApp } from "../app";
import { Firefly, FireflyCanvas } from "../models";

export interface ValueGeneratorParameters {
  currentFirefly: Firefly,
  canvas: FireflyCanvas,
  fireflies: Firefly[],
  app: FireflyApp
}

export type GeneratorValueOnCanvasCallback<T> = (canvas: FireflyCanvas) => T;

export type ValueGenerator<T> = (parameters: ValueGeneratorParameters) => T;