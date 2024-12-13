import { FireflyApp } from "../app";
import { Firefly, FireflyCanvas } from "../models";

export type GeneratorValueOnCanvasCallback<T> = (canvas: FireflyCanvas) => T;

export type GenerateValueCallback<T> = (
  currentFirefly: Firefly,
  canvas: FireflyCanvas,
  fireflies: Firefly[],
  app: FireflyApp
) => T;