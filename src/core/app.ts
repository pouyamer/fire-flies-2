import { Service } from "./interfaces";
import { FireflyCanvas } from "./models";

export class App {

  private canvas: FireflyCanvas
  private services: Service[];

  constructor(
    canvas: FireflyCanvas,
    services: Service[]
  ) {
    this.canvas = canvas;
    this.services = services;
    // services will execute here

  }

  public run = (): void => {
    requestAnimationFrame(this.run)

    this.services.forEach(service => {
      service.execute();
    })
  }
}