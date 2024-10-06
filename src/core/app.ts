import { Service } from "./interfaces";
import { Firefly, FireflyCanvas } from "./models";

export class App {

  private canvas: FireflyCanvas
  private services: Service[];
  private fireflies: Firefly[];

  constructor(
    canvas: FireflyCanvas,
    fireflies: Firefly[],
    services: Service[]
  ) {
    this.canvas = canvas;
    this.services = services;
    this.fireflies = fireflies;
    this.setServices();
    // services will execute here
  }

  public setServices() {
    for (let firefly of this.fireflies) {
      for (let service of this.services) {
        service.set(firefly)
      }
    }
  }

  public run = (): void => {
    requestAnimationFrame(this.run)
    this.canvas.renderingContext?.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.fireflies.forEach(
      ({ x, y, size, key }) => {

        const isOutOfBoundsFromLeft = x < -size.value / 2
        const isOutOfBoundsFromRight = x > this.canvas.width + size.value / 2
        const isOutOfBoundsFromTop = y < -size.value / 2
        const isOutOfBoundsFromBottom = y > this.canvas.height + size.value / 2

        if (
          isOutOfBoundsFromLeft ||
          isOutOfBoundsFromRight ||
          isOutOfBoundsFromTop ||
          isOutOfBoundsFromBottom
        ) {
          this.fireflies = this.fireflies.filter(f => f.key !== key)
        }
      }
    )


    for (let firefly of this.fireflies) {
      for (let service of this.services) {
        service.execute(firefly)
      }
    }
  }
}