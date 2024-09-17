import { Firefly, FireflyCanvas } from "../models";

export class EventsService {

  fireflies: Firefly[];
  canvas: FireflyCanvas;


  constructor(
    fireflies: Firefly[],
    canvas: FireflyCanvas,
  ) {
    this.fireflies = fireflies;
    this.canvas = canvas;
  }

  public execute(firefly: Firefly, onEventHandler?: (firefly: Firefly) => void) {
    this.fireflies.forEach(
      firefly => {
        if (firefly.x >= this.canvas.width + firefly.size.value) {
          if (onEventHandler) {
            onEventHandler(firefly);
          }
        }
      }
    )
  }
}