import { Color, FireflyCanvas } from "../models";
import { BoundsConfig } from "../types";

const DEFAULT_SETTER = {
  bottom: (canvas: FireflyCanvas) => canvas.height,
  top: (canvas: FireflyCanvas) => 0,
  left: (canvas: FireflyCanvas) => 0,
  right: (canvas: FireflyCanvas) => canvas.width
}

export const boundsConfig: BoundsConfig = {
  bottom: {
    type: "only-setter",
    setter: DEFAULT_SETTER.bottom,
  },
  left: {
    type: "only-setter",
    setter: DEFAULT_SETTER.left,
  },
  right: {
    type: "only-setter",
    setter: DEFAULT_SETTER.right,
  },
  top: {
    type: "only-setter",
    setter: DEFAULT_SETTER.top
  },
  general: {
    type: "out-of-bounds",
    onOutOfBounds: (ff, canvas) => {
      ff.x = canvas.width * Math.random();
      ff.y = canvas.height * Math.random();
      ff.speedY = ff.initialFireflySnapshot?.speedY ?? 0
      ff.speedX = ff.initialFireflySnapshot?.speedX ?? 0
    }
  }
}