import { Firefly, FireflyCanvas } from "../models";
import { EventConfig } from "../types";

const eventConfig: EventConfig = {
  onMaxSpeedChangeReached: (firefly: Firefly, canvas: FireflyCanvas) => {
    firefly.x = 2;
    canvas.color.alpha = 1
  }
}