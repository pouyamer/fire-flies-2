import { Firefly, FireflyCanvas } from "../models";
import { FireflyAppApiGetter } from "./app-services.type";

export type ValueGeneratorParameters = {
  api: FireflyAppApiGetter;
  firefly: Firefly,
}

export type GeneratorValueOnCanvasCallback<T> = (canvas: FireflyCanvas) => T;

export type ValueGenerator<T> = (parameters: ValueGeneratorParameters) => T;