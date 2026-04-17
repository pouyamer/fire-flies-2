import { FireflyAppApiGetter } from "./app-services.type";
import { ValueGeneratorWithFireflyParameters } from "./genarator-callback.type";

export type EventCallBackWithFirefly = (parameters: ValueGeneratorWithFireflyParameters) => void;
export type EventCallBack = (api: FireflyAppApiGetter) => void