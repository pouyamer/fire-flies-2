import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";

export class EventsService
  implements Service {
  fireflies: Firefly[];
  canvas: FireflyCanvas;


  constructor(
    fireflies: Firefly[],
    canvas: FireflyCanvas,
  ) {
    this.fireflies = fireflies;
    this.canvas = canvas;
  }

  public execute() {
    this.fireflies.forEach(
      firefly => {
        if (firefly.x >= this.canvas.width + firefly.size) {
          console.log("right reached!")
          firefly.x = Math.random() * this.canvas.width;
        }
      }
    )
  }
}