import { SpeedType } from "../enums"
import { Range } from "../models"

export type SpeedConfig = {
  type: SpeedType.Cartesian,
  speedX: Range | number,
  speedY: Range | number,
} |
{
  type: SpeedType.Polar,
  angle_PI: Range | number,
  speed: Range | number,
}