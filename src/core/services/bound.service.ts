import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig, Direction } from "../types";

export class BoundService implements Service {

  name = ServiceName.Bound;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: BoundsConfig,
    private readonly app: FireflyApp
  ) {
  }

  private touchedBoundFromDirection(
    firefly: Firefly,
    direction: "top" | "bottom" | "left" | "right"
  ): Boolean {
    switch (direction) {
      case "top":
        // correction of firefly getting out of bounds
        if (
          this.config.applyPositionCorrection?.top &&
          this.canvas.topBound !== null &&
          firefly.y - firefly.size.value < this.canvas.topBound - .1
        ) {
          firefly.y = this.canvas.topBound + firefly.size.value
        }
        
        return (
          this.canvas.topBound !== null &&
          firefly.y - firefly.size.value == this.canvas.topBound
        );
      case "bottom":

        if (
          this.config.applyPositionCorrection?.bottom &&
          this.canvas.bottomBound !== null &&
          firefly.y + firefly.size.value > this.canvas.bottomBound - .1
        ) {
          firefly.y = this.canvas.bottomBound - firefly.size.value
        }

        return (
          this.canvas.bottomBound !== null &&
          firefly.y + firefly.size.value == this.canvas.bottomBound
        );
      case "left":
        
        if (
          this.config.applyPositionCorrection?.left &&
          this.canvas.leftBound !== null &&
          firefly.x - firefly.size.value <= this.canvas.leftBound - .1
        ) {
          firefly.x = this.canvas.leftBound + firefly.size.value
        }
        
        return (
          this.canvas.leftBound !== null &&
          firefly.x - firefly.size.value <= this.canvas.leftBound
        );
      case "right":

        if (
          this.config.applyPositionCorrection?.right &&
          this.canvas.rightBound !== null &&
          firefly.x + firefly.size.value >= this.canvas.rightBound - .1
        ) {
          firefly.x = this.canvas.rightBound - firefly.size.value
        }

        return (
          this.canvas.rightBound !== null &&
          firefly.x + firefly.size.value >= this.canvas.rightBound
        )
    }
  }

  private outOfBoundFromDirection(
    firefly: Firefly,
    direction: "top" | "bottom" | "left" | "right"
  ): boolean {
    switch(direction) {
      case "top":
        return (
          this.canvas.topBound !== null &&
          firefly.y + firefly.size.value <= this.canvas.topBound
        );
      case "bottom":
        return (
          this.canvas.bottomBound !== null &&
          firefly.y - firefly.size.value >= this.canvas.bottomBound
        )
      case "left":
        return (
          this.canvas.leftBound !== null &&
          firefly.x + firefly.size.value <= this.canvas.leftBound
        );
      case "right":
        return (
          this.canvas.rightBound !== null &&
          firefly.x - firefly.size.value >= this.canvas.rightBound
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
            currentFirefly: firefly,
            canvas: this.canvas, 
            fireflies: this.fireflies,
            app: this.app
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
          currentFirefly: firefly,
          canvas: this.canvas, 
          fireflies: this.fireflies,
          app: this.app
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
          currentFirefly: firefly,
          canvas: this.canvas, 
          fireflies: this.fireflies,
          app: this.app
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
          currentFirefly: firefly,
          canvas: this.canvas, 
          fireflies: this.fireflies,
          app: this.app
        });
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
  }

  public setOnEveryFirefly() {

    const {left, top, right, bottom} = this.config

    this.canvas.leftBound = (left !== null && left !== undefined)
      ? typeof left === 'number'
        ? left
        : left(this.canvas)
      : null;


    this.canvas.topBound = (top !== null && top !== undefined)
      ? typeof top === 'number'
        ? top
        : top(this.canvas)
      : null;

    this.canvas.rightBound = (right !== null && right !== undefined)
      ? typeof right === 'number'
        ? right
        : right(this.canvas)
      : null;

    this.canvas.bottomBound = (bottom !== null && bottom !== undefined)
      ? typeof bottom === 'number'
        ? bottom
        : bottom(this.canvas)
      : null;


    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === this.name
    );
    
    if (serviceExists) {
      const directions: Direction[] = ["bottom", "left", "right", "top"];

      this.handleOutOfBoundsByDirection(firefly);
      this.handleTouchedBoundByDirection(firefly);

      directions.forEach(
        direction => {
          this.handleTouchedBoundByDirection(firefly, direction);
          this.handleOutOfBoundsByDirection(firefly, direction);
        }
      )

    }
  }

  public onFramePass() {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }

}