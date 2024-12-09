import { AccelerationType } from "../enums";
import { Range } from "../models"
import { BaseConfig } from "./base-config.type";

export type AccelerationConfig = BaseConfig &( {
  type: AccelerationType.Cartesian;
  accX: number | Range;
  accY: number | Range;
} |
{
  type: AccelerationType.CartesianInDirection;
  // number gets added to current speedX and speedY regardless if you entered positive or negative
  // preserving sign
  accX: number | Range;
  accY: number | Range;
} |
{
  type: AccelerationType.Polar;
  angle_PI: number | Range
  acc: number | Range;
} |
{
  type: AccelerationType.PolarInDirection;
  acc: number | Range
})