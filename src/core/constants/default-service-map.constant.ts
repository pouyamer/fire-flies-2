import { accelerationConfig, alphaConfig, boundsConfig, hueConfig, lightnessConfig, locationConfig, saturationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "../configs";
import { ServiceName } from "../enums";
import { ServiceMap } from "../types";

export const DEFAULT_SERVICE_MAP: {
  [key: string]: ServiceMap
} = {
  hue: {
    name: "hue" as ServiceName,
    config: hueConfig
  },
  saturation: {
    name: "saturation" as ServiceName,
    config: saturationConfig
  },
  lightness: {
    name: "lightness" as ServiceName,
    config: lightnessConfig
  },
  alpha: {
    name: "alpha" as ServiceName,
    config: alphaConfig
  },
  size: {
    name: "size" as ServiceName,
    config: sizeConfig
  },
  speed: {
    name: "speed" as ServiceName,
    config: speedConfig
  },
  acceleration: {
    name: "acceleration" as ServiceName,
    config: accelerationConfig,
  },
  shape: {
    name: "shape" as ServiceName,
    config: shapeConfig,
  },
  location: {
    name: "location" as ServiceName,
    config: locationConfig,
  },
  draw: {
    name: "draw" as ServiceName,
  },
  bound: {
    name: "bound" as ServiceName,
    config: boundsConfig
  },
  window: {
    name: "window" as ServiceName,
    config: windowConfig,
  }
}
