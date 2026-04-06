import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, Direction, FireflyAppApiGetter } from "../types";

const directions: Direction[] = ["bottom", "left", "right", "top"];
export class BoundService implements Service {

  private fireflies: Firefly[] = [];


  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: BoundsConfig,
  ) {
  }

  private touchedBoundFromDirection(
    firefly: Firefly,
    direction: "top" | "bottom" | "left" | "right"
  ): Boolean {
    const canvas = this.appApi('canvas');

    switch (direction) {
      case "top":
        // correction of firefly getting out of bounds
        if (
          this.config.applyPositionCorrection?.top &&
          canvas.topBound !== null &&
          firefly.y - firefly.size.value < canvas.topBound - .1
        ) {
          firefly.y = canvas.topBound + firefly.size.value
        }

        return (
          canvas.topBound !== null &&
          firefly.y - firefly.size.value == canvas.topBound
        );
      case "bottom":

        if (
          this.config.applyPositionCorrection?.bottom &&
          canvas.bottomBound !== null &&
          firefly.y + firefly.size.value > canvas.bottomBound - .1
        ) {
          firefly.y = canvas.bottomBound - firefly.size.value
        }

        return (
          canvas.bottomBound !== null &&
          firefly.y + firefly.size.value == canvas.bottomBound
        );
      case "left":

        if (
          this.config.applyPositionCorrection?.left &&
          canvas.leftBound !== null &&
          firefly.x - firefly.size.value <= canvas.leftBound - .1
        ) {
          firefly.x = canvas.leftBound + firefly.size.value
        }

        return (
          canvas.leftBound !== null &&
          firefly.x - firefly.size.value <= canvas.leftBound
        );
      case "right":

        if (
          this.config.applyPositionCorrection?.right &&
          canvas.rightBound !== null &&
          firefly.x + firefly.size.value >= canvas.rightBound - .1
        ) {
          firefly.x = canvas.rightBound - firefly.size.value
        }

        return (
          canvas.rightBound !== null &&
          firefly.x + firefly.size.value >= canvas.rightBound
        )
    }
  }

  private outOfBoundFromDirection(
    firefly: Firefly,
    direction: "top" | "bottom" | "left" | "right"
  ): boolean {
    const canvas = this.appApi('canvas');

    switch (direction) {
      case "top":
        return (
          canvas.topBound !== null &&
          firefly.y + firefly.size.value <= canvas.topBound
        );
      case "bottom":
        return (
          canvas.bottomBound !== null &&
          firefly.y - firefly.size.value >= canvas.bottomBound
        )
      case "left":
        return (
          canvas.leftBound !== null &&
          firefly.x + firefly.size.value <= canvas.leftBound
        );
      case "right":
        return (
          canvas.rightBound !== null &&
          firefly.x - firefly.size.value >= canvas.rightBound
        )
    }
  }

  private handleOutOfBoundsByDirection(firefly: Firefly, direction?: Direction): void {
    if (!direction) {
      if (
        (this.config.left && this.outOfBoundFromDirection(firefly, "left")) ||
        (this.config.right && this.outOfBoundFromDirection(firefly, "right")) ||
        (this.config.top && this.outOfBoundFromDirection(firefly, "top")) ||
        (this.config.bottom && this.outOfBoundFromDirection(firefly, "bottom"))
      ) {
        const onOutOfBounds = typeof this.config.onFireflyOutOfBounds === "function"
          ? this.config.onFireflyOutOfBounds
          : this.config.onFireflyOutOfBounds?.all;

        onOutOfBounds?.({
          firefly: firefly,
          ...this.appApi(),
        });
      }
    }
    else if (
      this.outOfBoundFromDirection(firefly, direction) &&
      this.config[direction] &&
      this.config.onFireflyOutOfBounds &&
      typeof this.config.onFireflyOutOfBounds !== "function"
    ) {
      this.config.onFireflyOutOfBounds[direction]?.({
        firefly: firefly,
        ...this.appApi(),
      });
    }
  }

  private handleTouchedBoundByDirection(firefly: Firefly, direction?: Direction): void {
    if (!direction) {
      if (
        (this.config.left && this.touchedBoundFromDirection(firefly, "left")) ||
        (this.config.right && this.touchedBoundFromDirection(firefly, "right")) ||
        (this.config.top && this.touchedBoundFromDirection(firefly, "top")) ||
        (this.config.bottom && this.touchedBoundFromDirection(firefly, "bottom"))
      ) {
        const onTouchedBounds = typeof this.config.onFireflyTouchedBounds === "function"
          ? this.config.onFireflyTouchedBounds
          : this.config.onFireflyTouchedBounds?.all;

        onTouchedBounds?.({
          firefly: firefly,
          ...this.appApi(),
        });
      }
    }
    else if (
      this.touchedBoundFromDirection(firefly, direction) &&
      this.config[direction] &&
      this.config.onFireflyTouchedBounds &&
      typeof this.config.onFireflyTouchedBounds !== "function"
    ) {
      this.config.onFireflyTouchedBounds[direction]?.({
        firefly: firefly,
        ...this.appApi(),
      });
    }
  }

  private setBoundValueByCanvas(
    type: Direction,
    canvas: FireflyCanvas,
  ) {

    const dirConfig = this.config[type];

    const value = (dirConfig !== null && dirConfig !== undefined)
      ? typeof dirConfig === 'number'
        ? dirConfig
        : dirConfig(canvas)
      : null;

    canvas[`${type}Bound`] = value;
  }

  public addFirefly(firefly: Firefly): void {
    this.fireflies.push(firefly)
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    firefly.serviceToggle.activate('bounds')
  }

  public setOnEveryFirefly() {

    for (const ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }

    const canvas = this.appApi('canvas');

    directions.forEach(
      d => {
        this.setBoundValueByCanvas(d, canvas);
      }
    )
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    if (firefly.serviceToggle.get('bounds')) {
      this.handleOutOfBoundsByDirection(firefly);
      this.handleTouchedBoundByDirection(firefly);

      directions.forEach(
        direction => {
          this.handleTouchedBoundByDirection(firefly, direction);
          this.handleOutOfBoundsByDirection(firefly, direction);
        }
      );
    }
  }

  public onFramePass() {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }


}