import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { BoundsConfig } from "../types";

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
        return (
          this.canvas.topBound !== null &&
          firefly.y - firefly.size.value <= this.canvas.topBound
        );
      case "bottom":
        return (
          this.canvas.bottomBound !== null &&
          firefly.y + firefly.size.value >= this.canvas.bottomBound
        );
      case "left":
        return (
          this.canvas.leftBound !== null &&
          firefly.x - firefly.size.value <= this.canvas.leftBound
        );
      case "right":
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

  private handleOutOfTopBound(firefly: Firefly): void {
    if (
      this.outOfBoundFromDirection(firefly, "top") &&
      this.config.top?.setter &&
      this.config.top?.type === "out-of-bounds" &&
      this.config.top.onOutOfBounds
    ) {
        // on out of top bound
        this.config.top.onOutOfBounds(
          firefly,
          this.canvas,
          this.fireflies,
          this.app
        )
    }
  }

  private handleTouchedTopBound(firefly: Firefly): void {
    if (
      this.touchedBoundFromDirection(firefly, "top") &&
      this.config.top?.type === "touched-bounds" &&
      this.config.top.onTouchedBounds
    ) {
    // on top bound
      this.config.top.onTouchedBounds(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  private handleOutOfLeftBound(firefly: Firefly): void {
    if (
      this.outOfBoundFromDirection(firefly, "left") &&
      this.config.left?.type === "out-of-bounds" &&
      this.config.left.onOutOfBounds
    ) {
        // on out of top bound
        this.config.left.onOutOfBounds(
          firefly,
          this.canvas,
          this.fireflies,
          this.app
        )
    }
  }

  private handleTouchedLeftBound(firefly: Firefly): void {
    if (
      this.touchedBoundFromDirection(firefly, "left") &&
      this.config.left?.type === "touched-bounds" &&
      this.config.left.onTouchedBounds
    ) {
    // on top bound
      this.config.left.onTouchedBounds(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  private handleOutOfBottomBound(firefly: Firefly): void {
    if (
      this.outOfBoundFromDirection(firefly, "bottom") &&
      this.config.bottom?.type === "out-of-bounds" &&
      this.config.bottom.onOutOfBounds
    ) {
        // on out of top bound
        this.config.bottom.onOutOfBounds(
          firefly,
          this.canvas,
          this.fireflies,
          this.app
        )
    }
  }

  private handleTouchedBottomBound(firefly: Firefly): void {
    if (
      this.touchedBoundFromDirection(firefly, "bottom") &&
      this.config.bottom?.type === "touched-bounds" &&
      this.config.bottom.onTouchedBounds
    ) {
    // on top bound
      this.config.bottom.onTouchedBounds(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  private handleOutOfRightBound(firefly: Firefly): void {
    if (
      this.outOfBoundFromDirection(firefly, "right") &&
      this.config.right?.type === "out-of-bounds" &&
      this.config.right.onOutOfBounds
    ) {
        // on out of top bound
        this.config.right.onOutOfBounds(
          firefly,
          this.canvas,
          this.fireflies,
          this.app
        )
    }
  }

  private handleTouchedRightBound(firefly: Firefly): void {
    if (
      this.touchedBoundFromDirection(firefly, "right") &&
      this.config.right?.type === "touched-bounds" &&
      this.config.right.onTouchedBounds
    ) {
    // on top bound
      this.config.right.onTouchedBounds(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  private handleOutOfBoundsGeneral(firefly: Firefly): void {
    if (
      (
        this.outOfBoundFromDirection(firefly, "top") ||
        this.outOfBoundFromDirection(firefly, "bottom") ||
        this.outOfBoundFromDirection(firefly, "left") ||
        this.outOfBoundFromDirection(firefly, "right")
      ) && 
      this.config.general?.type === "out-of-bounds" &&
      this.config.general.onOutOfBounds
    ) {
      this.config.general.onOutOfBounds(firefly, this.canvas, this.fireflies, this.app)
    }
  }

  private handleTouchedBoundsGeneral(firefly: Firefly): void {
    if (
      (
        this.touchedBoundFromDirection(firefly, "top") ||
        this.touchedBoundFromDirection(firefly, "bottom") ||
        this.touchedBoundFromDirection(firefly, "left") ||
        this.touchedBoundFromDirection(firefly, "right")
      ) && 
      this.config.general?.type === "touched-bounds" &&
      this.config.general.onTouchedBounds
    ) {
      this.config.general.onTouchedBounds(
        firefly,
        this.canvas, 
        this.fireflies,
        this.app
      )
    }
  }

  public setOnSingleFirefly(firefly: Firefly): void {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
  }

  public setOnEveryFirefly() {
    const {
      bottom,
      left,
      right,
      top
    } = this.config;

    this.canvas.leftBound = left
      ? left.setter(this.canvas)
      : null;

    this.canvas.rightBound = right
      ? right.setter(this.canvas)
      : null;

    this.canvas.topBound = top
      ? top.setter(this.canvas)
      : null;

    this.canvas.bottomBound = bottom
      ? bottom.setter(this.canvas)
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

      this.handleTouchedBoundsGeneral(firefly);
      this.handleOutOfBoundsGeneral(firefly);
      
      this.handleTouchedTopBound(firefly);
      this.handleOutOfTopBound(firefly);

      this.handleTouchedLeftBound(firefly);
      this.handleOutOfLeftBound(firefly);

      this.handleTouchedBottomBound(firefly);
      this.handleOutOfBottomBound(firefly);

      this.handleTouchedRightBound(firefly);
      this.handleOutOfRightBound(firefly);

    }
  }

  public onFramePass() {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff);
    }
  }

}