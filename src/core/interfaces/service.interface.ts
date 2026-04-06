import { Firefly } from "../models";

export declare interface Service {
  addFirefly (firefly: Firefly): void;
  setOnSingleFirefly (firefly: Firefly): void;
  setOnEveryFirefly (): void;
  onFramePassForSingleFirefly (firefly: Firefly): void;
  onFramePass ():void;
}