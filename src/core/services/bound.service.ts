import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { BoundsConfig, Direction, FireflyAppApiGetter } from "../types";

export class BoundService implements Service {

  private fireflies: Firefly[];
  name = ServiceName.Bound;

  
  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: BoundsConfig,
  ) {
    this.fireflies = [...appApi('fireflies')];
  }

  public addFireflies(fireflies: Firefly[]): void {
    const fireflyKeys = this.fireflies.map(({key}) => key);

    for(const ff of fireflies) {
      if (!fireflyKeys.includes(ff.key)) fireflies.push(ff);
      this.setOnSingleFirefly();
    }
  }

  public removeFireflies(fireflies: Firefly[]): void {
    const removingFireflyKeys = fireflies.map(({key}) => key);
    
    this.fireflies = this.fireflies.filter(({key}) => !removingFireflyKeys.includes(key));
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
    const canvas = this.appApi('canvas')
    switch(direction) {
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

  public setOnSingleFirefly(): void {
  }

  public setOnEveryFirefly() {

    const {left, top, right, bottom} = this.config;

    const canvas = this.appApi('canvas');

    canvas.leftBound = (left !== null && left !== undefined)
      ? typeof left === 'number'
        ? left
        : left(canvas)
      : null;


    canvas.topBound = (top !== null && top !== undefined)
      ? typeof top === 'number'
        ? top
        : top(canvas)
      : null;

    canvas.rightBound = (right !== null && right !== undefined)
      ? typeof right === 'number'
        ? right
        : right(canvas)
      : null;

    canvas.bottomBound = (bottom !== null && bottom !== undefined)
      ? typeof bottom === 'number'
        ? bottom
        : bottom(canvas)
      : null;


    // for(let ff of this.fireflies) {
    //   this.setOnSingleFirefly()
    // }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    
    const directions: Direction[] = ["bottom", "left", "right", "top"];

    this.handleOutOfBoundsByDirection(firefly);
    this.handleTouchedBoundByDirection(firefly);

    directions.forEach(
      direction => {
        this.handleTouchedBoundByDirection(firefly, direction);
        this.handleOutOfBoundsByDirection(firefly, direction);
      }
    );

  }

  public onFramePass() {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }

}