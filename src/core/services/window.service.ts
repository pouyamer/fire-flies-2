import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, ValueGeneratorWithFireflyParameters, WindowConfig } from "../types";

export class WindowService
  implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'window';

  private mouseHoveredFirefliesKeys: Firefly["key"][] = [];

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: WindowConfig,
  ) {
  }

  private setResizeEventListener(): void {
    window.addEventListener("resize", () => {
      this.appApi('canvas').setWidthAndHeight(window.innerWidth, window.innerHeight)
      this.appApi('methods').resetServicesByKeys('bounds');
    })
  }

  private isMouseInsideFirefly(ff: Firefly): boolean {
    const canvas = this.appApi('canvas');

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
    window.addEventListener("click", (/* e: MouseEvent */) => {
      this.appApi('methods').togglePauseApplication();
    })
  }

  private handleOnFireflyHovered(ff: Firefly): void {
    const parameters: ValueGeneratorWithFireflyParameters = {
      api: this.appApi,
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
    window.addEventListener("mousemove", (e: MouseEvent) => {
      const canvas = this.appApi('canvas');

      clearTimeout(this.timeOut);

      this.timeOut = setTimeout(
        () => {

          canvas.setMousePosition({
            x: null,
            y: null
          })

        }, 200
      )

      canvas.setMousePosition({
        x: e.x,
        y: e.y
      })

    })
  }

  private setMouseLeaveEventListener(): void {
    window.addEventListener("mouseout", (e: MouseEvent) => {
      this.appApi('canvas').setMousePosition({
        x: null,
        y: null
      })
    })
  }

  add(firefly: Firefly): void {
    if (!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if (this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }


  set(): void {
    for(let ff of this.fireflies) {
      this.setOne(ff)
    }
    this.setResizeEventListener();
    this.setMouseClickEventListener();
    this.setMouseMoveEventListener();
    this.setMouseLeaveEventListener();
  }

  setOne(firefly: Firefly): void {
    // this.handleOnFireflyHovered(firefly)
  }

  updateOne(firefly: Firefly): void {
    this.handleOnFireflyHovered(firefly)

  }

  update(): void {
    this.fireflies.forEach(ff => {
      this.updateOne(ff)
    })
  }
}