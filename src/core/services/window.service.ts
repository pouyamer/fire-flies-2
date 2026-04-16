import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyAppApiGetter, ValueGeneratorParameters, WindowConfig } from "../types";

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
    window.addEventListener("click", (/* e: MouseEvent */) => {
      this.appApi('methods').togglePauseApplication();
    })
  }

  private handleOnFireflyHovered(ff: Firefly): void {
    const parameters: ValueGeneratorParameters = {
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
    window.addEventListener("mouseout", (e: MouseEvent) => {
      this.appApi('canvas').mouseX = null;
      this.appApi('canvas').mouseY = null;
    })
  }

  add(firefly: Firefly): void {
    if(!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if(this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }


  set(): void {
    // for(let ff of this.fireflies) {
    //   this.setOnSingleFirefly(/* ff */)
    // }
    this.setResizeEventListener();
    this.setMouseClickEventListener();
    this.setMouseMoveEventListener();
    this.setMouseLeaveEventListener();
  }

  setOne(firefly: Firefly): void {
    this.handleOnFireflyHovered(firefly)
  }

  updateOne(/* firefly: Firefly */): void {
  }

  update(): void {
    this.fireflies.forEach(ff => {
      this.updateOne()
    })
  }
}