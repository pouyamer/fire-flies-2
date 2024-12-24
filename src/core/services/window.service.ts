import { FireflyApp } from "../app";
import { ServiceName, Shape } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { WindowConfig } from "../types";
import { Utilities } from "../utilities";

export class WindowService
  implements Service {
  
    name = ServiceName.Window;

    constructor(
      private readonly canvas: FireflyCanvas,
      private readonly fireflies: Firefly[],
      private readonly config: unknown,
      private readonly windowContext: Window,
      private readonly fireflyApp: FireflyApp
    ) {}

    private setResizeEventListener(): void {
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

    private setMouseClickEventListener(): void {
      this.windowContext.addEventListener("click", (e: MouseEvent) => {
        const newFirefly = new Firefly();

        this.fireflies.push(newFirefly)
        
        this.fireflyApp.setServicesOnSingleFirefly(newFirefly)

        newFirefly.x = e.clientX;
        newFirefly.y = e.clientY
      })
    }


    private setMouseMoveEventListener(): void {
      this.windowContext.addEventListener("mousemove", (e: MouseEvent) => {
        this.fireflies.forEach(
          ff => {
            const distanceToFireFly = Utilities.calculateDistance(ff.x, ff.y, e.clientX, e.clientY)
            if (distanceToFireFly < 100) {

              ff.alpha.value = 0
              ff.rotateSpeed = 0
            }

          }
        )
      })
    }

    setOnEveryFirefly(): void {
      for(let ff of this.fireflies) {
        this.setOnSingleFirefly(ff)
      }
      this.setResizeEventListener();
      this.setMouseClickEventListener();
      this.setMouseMoveEventListener();
    }

    onFramePassForSingleFirefly(firefly: Firefly): void {
      
    }

    setOnSingleFirefly(firefly: Firefly): void {
      if (!firefly.activeServices?.some(service => service.name === this.name)) {
        firefly.activeServices?.push(this)
      }
    }

    onFramePass(): void {
      
    }
}