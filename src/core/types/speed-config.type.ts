import { SpeedType } from "../enums"
import { Firefly, Range } from "../models"
import { BaseConfig } from "./base-config.type"

export type SpeedConfig = BaseConfig & ({
  type: SpeedType.Cartesian,
  speedX: Range | number,
  speedY: Range | number,
} |
{
  type: SpeedType.Polar,
  angle_PI: Range | number,
  speed: Range | number,
} |
{
  type: SpeedType.ChangerCallback,
  changerX: (value: Firefly) => number,
  changerY: (value: Firefly) => number,
})