import { ServiceName, Shape } from "../enums";
import { Color, FireflyCanvas } from "../models";
import { BoundsConfig } from "../types";

const DEFAULT_SETTER = {
  bottom: (canvas: FireflyCanvas) => canvas.height,
  top: (canvas: FireflyCanvas) => 0,
  left: (canvas: FireflyCanvas) => 0,
  right: (canvas: FireflyCanvas) => canvas.width
}

export const boundsConfig: BoundsConfig = {
  name: ServiceName.Bound,
  bottom: {
    type: "only-setter",
    setter: DEFAULT_SETTER.bottom
  },
  top: {
    type: "only-setter",
    setter: DEFAULT_SETTER.top
  },
  right: {
    type: "only-setter",
    setter: DEFAULT_SETTER.right
  },
  left: {
    type: "only-setter",
    setter: DEFAULT_SETTER.left
  },
  general: {
    type: "out-of-bounds",
    onOutOfBounds: (ff,c,ffs, a) => {
      a.setServicesOnSingleFirefly(ff)
    }
  }
  
}