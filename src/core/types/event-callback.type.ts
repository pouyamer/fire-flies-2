import { FireflyApp } from "../app";
import { Firefly, FireflyCanvas } from "../models";

export type EventCallBack = (
  firefly: Firefly,
  canvas: FireflyCanvas,
  fireflies: Firefly[],
  app: FireflyApp
) => void