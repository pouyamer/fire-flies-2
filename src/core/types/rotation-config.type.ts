import { Range } from "../models";

export type RotationConfig = {
  speed_PI: number | Range;
  startingAngle: number | Range;
  acceleration_PI: number | Range;
}