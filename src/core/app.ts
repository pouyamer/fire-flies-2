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
    for (let firefly of this.fireflies) {
      for (let service of this.services) {
        service.execute(firefly)
      }
    }
  }
}