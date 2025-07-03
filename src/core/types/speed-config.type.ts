import { SpeedType } from "../enums"
import { PossibleValue } from "./possible-value.type"

export type SpeedConfig ={
  type: SpeedType.Cartesian,
  speedX: PossibleValue<number>,
  speedY: PossibleValue<number>,
} |
{
  type: SpeedType.Polar,
  angle_PI: PossibleValue<number>,
  speed: PossibleValue<number>,
}