import { boundsConfig, collisionConfig, drawConfig, generalFireflyConfig, globalFireflyModifierConfig, hslColorConfig, jitterConfig, lifeConfig, locationConfig, neighbourhoodConfig, rgbColorConfig, rotationConfig, shapeConfig, sizeConfig, speedConfig, windowConfig } from "../configs";
import { HslColor } from "../models";
import { DefaultValue, FireflyServiceConfigs } from "../types";

export const DEFAULT_VALUE: DefaultValue = {
  Color: new HslColor(),
  CanvasHeight: 1,
  CanvasWidth: 1,
}

export const FIREFLY_SERVICE_DEFAULT_CONFIGS: FireflyServiceConfigs = {
    bound: boundsConfig,
    collision: collisionConfig,
    draw: drawConfig,
    globalFireflyModifier: globalFireflyModifierConfig,
    jitter: jitterConfig,
    location: locationConfig,
    rotation: rotationConfig,
    shape: shapeConfig,
    size: sizeConfig,
    speed: speedConfig,
    window: windowConfig,
    generalFirefly: generalFireflyConfig,
    neighbourhood: neighbourhoodConfig,
    life: lifeConfig,
    hslColor: hslColorConfig,
    rgbColor: rgbColorConfig,
  }