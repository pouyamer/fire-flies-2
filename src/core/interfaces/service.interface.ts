import { ServiceName } from "../enums";
import { Firefly } from "../models";

export declare interface Service {
  name: ServiceName;
  setOnSingleFirefly (firefly: Firefly): void;
  setOnEveryFirefly (): void;
  onFramePassForSingleFirefly (firefly: Firefly): void;
  onFramePass ():void;
}