import { FireflyApp } from "../app";
import { DrawService } from "./draw.service";

export class DrawLoopService {

  private drawHz: number;
  private get drawStep() { return 1000 / this.drawHz; }

  private accum = 0;
  private last = performance.now();
  private running = false;

  constructor(
    private readonly drawServiceResolver: () => DrawService,
    drawFPS: number
  ) {
    this.drawHz = Math.max(1, drawFPS);
  }

  private drawStepFn() {
    const drawService = this.drawServiceResolver();
    drawService?.onFramePass();
  }

  private loop = (ts?: number) => {
    if (!this.running) return;

    ts ??= performance.now();
    const delta = ts - this.last;

    this.last = ts;
    this.accum += delta;

    while (this.accum >= this.drawStep) {
      this.drawStepFn();
      this.accum -= this.drawStep;
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
