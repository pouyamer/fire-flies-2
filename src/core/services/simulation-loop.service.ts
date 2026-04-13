import { FireflyAppApiGetter, ServiceType } from "../types";

export class SimulationLoopService {

  private simHz: number;
  private get simStep() { return 1000 / this.simHz; }

  private accum = 0;
  private last = performance.now();
  private running = false;

  constructor(
    private readonly api: FireflyAppApiGetter,
    private readonly getServices: () => ServiceType[],
    simulationFPS: number
  ) {
    this.simHz = Math.max(1, simulationFPS);
  }

  private stepSimulation() {
    const drawService = this.api('methods').getServiceByKey('draw');
    for (let s of this.getServices()) {
      if (s !== drawService) s.onFramePass();
    }
  }

  private loop = (ts?: number) => {
    if (!this.running) return;

    ts ??= performance.now();
    const delta = ts - this.last;

    this.last = ts;
    this.accum += delta;

    while (this.accum >= this.simStep) {
      this.stepSimulation();
      this.accum -= this.simStep;
    }

    requestAnimationFrame(this.loop);
  };

  public start() {
    if (!this.running) {
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame(this.loop);
    }
  }

  public stop() { this.running = false; }
}
