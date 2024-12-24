import { SpeedType } from "../enums"
import { BaseConfig } from "./base-config.type"
import { PossibleValue } from "./possible-value.type"

export type SpeedConfig = BaseConfig & ({
  type: SpeedType.Cartesian,
  speedX: PossibleValue,
  speedY: PossibleValue,
} |
{
  type: SpeedType.Polar,
  angle_PI: PossibleValue,
  speed: PossibleValue,
})