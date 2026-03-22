import { Firefly, FireflyCanvas } from "../models";
import { FireflyAppApi } from "./app-services.type";

export type ValueGeneratorParameters = FireflyAppApi & {
  firefly: Firefly,
}

export type GeneratorValueOnCanvasCallback<T> = (canvas: FireflyCanvas) => T;

export type ValueGenerator<T> = (parameters: ValueGeneratorParameters) => T;