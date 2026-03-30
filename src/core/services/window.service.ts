import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, ValueGeneratorParameters, WindowConfig } from "../types";

export class WindowService
  implements Service {

  private fireflies: Firefly[];
  name = ServiceName.Window;

  private mouseHoveredFirefliesKeys: Firefly["key"][] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: WindowConfig,
    private readonly windowContext: Window,
  ) {
    this.fireflies = [...appApi('fireflies')];
  }

  public addFireflies(fireflies: Firefly[]): void {
    const fireflyKeys = this.fireflies.map(({ key }) => key);

    for (const ff of fireflies) {
      if (!fireflyKeys.includes(ff.key)) fireflies.push(ff);
      this.setOnSingleFirefly(/* ff */);
    }
  }

  public removeFireflies(fireflies: Firefly[]): void {
    const removingFireflyKeys = fireflies.map(({ key }) => key);

    this.fireflies = this.fireflies.filter(({ key }) => !removingFireflyKeys.includes(key));
  }

  private setResizeEventListener(): void {
    this.windowContext.addEventListener("resize", () => {
      this.appApi('canvas').setWidthAndHeight(this.windowContext.innerWidth, this.windowContext.innerHeight)
      for (let ff of this.fireflies) {
        this.appApi('app').setServicesOnSingleFireflyByServiceNames(ff, ServiceName.Location, ServiceName.Bound)
      }
    })
  }

  private isMouseInsideFirefly(ff: Firefly): boolean {
    const canvas = this.appApi('canvas')
    return (
      !!canvas.mouseX &&
      !!canvas.mouseY &&
      canvas.mouseX <= ff.x + (ff.size.value + this.config.mousePositionFuzziness) &&
      canvas.mouseX >= ff.x - (ff.size.value + this.config.mousePositionFuzziness) &&
      canvas.mouseY <= ff.y + (ff.size.value + this.config.mousePositionFuzziness) &&
      canvas.mouseY >= ff.y - (ff.size.value + this.config.mousePositionFuzziness)
    )
  }

  private setMouseClickEventListener(): void {
    this.windowContext.addEventListener("click", (/* e: MouseEvent */) => {
      this.appApi('app').togglePauseApplication();
    })
  }

  private handleOnFireflyHovered(ff: Firefly): void {
    const parameters: ValueGeneratorParameters = {
      ...this.appApi(),
      firefly: ff,
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

  private timeOut: number | undefined;


  private setMouseMoveEventListener(): void {
    this.windowContext.addEventListener("mousemove", (e: MouseEvent) => {
      clearTimeout(this.timeOut);

      // this.timeOut = setTimeout(
      //   () => {
      //     this.canvas.mouseX = null;
      //     this.canvas.mouseY = null;

      //   }, 200
      // )

      this.appApi('canvas').mouseX = e.x;
      this.appApi('canvas').mouseY = e.y;
    })
  }

  private setMouseLeaveEventListener(): void {
    this.windowContext.addEventListener("mouseout", (e: MouseEvent) => {
      this.appApi('canvas').mouseX = null;
      this.appApi('canvas').mouseY = null;
    })
  }


  setOnEveryFirefly(): void {
    // for(let ff of this.fireflies) {
    //   this.setOnSingleFirefly(/* ff */)
    // }
    this.setResizeEventListener();
    this.setMouseClickEventListener();
    this.setMouseMoveEventListener();
    this.setMouseLeaveEventListener();
  }

  onFramePassForSingleFirefly(firefly: Firefly): void {
    this.handleOnFireflyHovered(firefly)
  }

  setOnSingleFirefly(/* firefly: Firefly */): void {
  }

  onFramePass(): void {
    this.fireflies.forEach(ff => {
      this.onFramePassForSingleFirefly(ff)
    })
  }
}