import { Firefly, FireflyCanvas } from "../models";

export type EventCallBack = (
  firefly: Firefly,
  canvas: FireflyCanvas,
  fireflies: Firefly[],
) => void