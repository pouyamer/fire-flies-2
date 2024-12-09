import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";

export class WindowService
  implements Service {
  
    name = ServiceName.Window;

    constructor(
      private readonly canvas: FireflyCanvas,
      private readonly fireflies: Firefly[],
      private readonly config: unknown,
      private readonly windowContext: Window,
    ) {}

    public setResizeEventListener(): void {
      this.windowContext.addEventListener("resize", (e: Event) => {
        this.canvas.setWidthAndHeight(this.windowContext.innerWidth, this.windowContext.innerHeight)
        for( let ff of this.fireflies) {
          for (let s of ff.activeServices) {
            if (s.name === ServiceName.Bound) {
              s.setOnEveryFirefly();
              return;
            }
          }
        }
      })
    }

    setOnEveryFirefly(): void {
      for(let ff of this.fireflies) {
        this.setOnSingleFirefly(ff)
      }
      this.setResizeEventListener();
    }

    setOnSingleFirefly(firefly: Firefly): void {
      if (!firefly.activeServices?.some(service => service.name === this.name)) {
        firefly.activeServices?.push(this)
      }
    }

    onFramePass(): void {
      
    }
}