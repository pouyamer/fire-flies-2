import { Firefly, FireflyCanvas } from "../models";
import { FireflyAppApiGetter } from "./app-services.type";

export type ValueGeneratorWithFireflyParameters = {
  api: FireflyAppApiGetter;
  firefly: Firefly
}


export type GeneratorValueOnCanvasCallback<T> = (canvas: FireflyCanvas) => T;

export type ValueGeneratorWithFirefly<T> = (parameters: ValueGeneratorWithFireflyParameters) => T;