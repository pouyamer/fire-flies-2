import { FireflyApp } from "../app";
import { ServiceName, Shape } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { ValueGeneratorParameters, WindowConfig } from "../types";
import { Utilities } from "../utilities";

export class WindowService
  implements Service {
  
    name = ServiceName.Window;

    private mouseHoveredFirefliesKeys: Firefly["key"][] = [];

    constructor(
      private readonly canvas: FireflyCanvas,
      private readonly fireflies: Firefly[],
      private readonly config: WindowConfig,
      private readonly windowContext: Window,
      private readonly app: FireflyApp
    ) {}

    private setResizeEventListener(): void {
      this.windowContext.addEventListener("resize", (e: Event) => {
        this.canvas.setWidthAndHeight(this.windowContext.innerWidth, this.windowContext.innerHeight)
        for( let ff of this.fireflies) {
          this.app.setServicesOnSingleFireflyByServiceNames(ff, ServiceName.Bound)
        }
      })
    }

    private isMouseInsideFirefly(ff: Firefly): boolean {
      return (
        !!this.canvas.mouseX &&
        !!this.canvas.mouseY &&
        this.canvas.mouseX <= ff.x + (ff.size.value + this.config.mousePositionFuzziness) &&
        this.canvas.mouseX >= ff.x - (ff.size.value + this.config.mousePositionFuzziness) &&
        this.canvas.mouseY <= ff.y + (ff.size.value + this.config.mousePositionFuzziness) &&
        this.canvas.mouseY >= ff.y - (ff.size.value + this.config.mousePositionFuzziness)
      )
    }

    private setMouseClickEventListener(): void {
      this.windowContext.addEventListener("click", (e: MouseEvent) => {
        // this.fireflyApp.togglePauseApplication();
        this.fireflies.filter(ff => this.isMouseInsideFirefly(ff)).forEach(
          ff => this.app.markFireflyAsCandidate(ff)
        )
      })
    }

    private handleOnFireflyHovered(ff: Firefly): void {
      const parameters: ValueGeneratorParameters = {
        app: this.app,
        canvas: this.canvas,
        currentFirefly: ff,
        fireflies: this.fireflies
      }
      
      if (this.isMouseInsideFirefly(ff)) {
        this.config.onFireflyMouseOver?.(parameters)

        if (!this.mouseHoveredFirefliesKeys.includes(ff.key)) {
          this.config.onFireflyMouseEnter?.(parameters)
          this.mouseHoveredFirefliesKeys.push(ff.key)
        }
      }
      else if (this.mouseHoveredFirefliesKeys.includes(ff.key)) {
        this.config.onFireflyMouseLeave?.(parameters)

        this.mouseHoveredFirefliesKeys = this.mouseHoveredFirefliesKeys.filter(key => ff.key !== key);
      }
    }


    private setMouseMoveEventListener(): void {
      this.windowContext.addEventListener("mousemove", (e: MouseEvent) => {
        this.canvas.mouseX = e.x;
        this.canvas.mouseY = e.y;
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
      this.handleOnFireflyHovered(firefly)
    }

    setOnSingleFirefly(firefly: Firefly): void {
      if (!firefly.activeServices?.some(service => service.name === this.name)) {
        firefly.activeServices?.push(this)
      }
    }

    onFramePass(): void {
      this.fireflies.forEach(ff => {
        this.onFramePassForSingleFirefly(ff)
      })
    }
}