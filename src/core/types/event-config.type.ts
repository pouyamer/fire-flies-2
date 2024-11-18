import { Firefly, FireflyCanvas } from "../models"

export type EventConfig = {
  onMaxSpeedChangeReached:
  | ((firefly: Firefly) => void)
  | ((canvas: FireflyCanvas) => void)
  | ((firefly: Firefly, canvas: FireflyCanvas) => void)
}