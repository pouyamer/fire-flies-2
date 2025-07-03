import { AccelerationType } from "../enums";
import { PossibleValue } from "./possible-value.type";

export type AccelerationConfig =  {
  type: AccelerationType.Cartesian;
  accX: PossibleValue<number>;
  accY: PossibleValue<number>;
} |
{
  type: AccelerationType.CartesianInDirection;
  // number gets added to current speedX and speedY regardless if you entered positive or negative
  // preserving sign
  accX: PossibleValue<number>;
  accY: PossibleValue<number>;
} |
{
  type: AccelerationType.Polar;
  angle_PI: PossibleValue<number>
  acc: PossibleValue<number>;
} |
{
  type: AccelerationType.PolarInDirection;
  acc: PossibleValue<number>
}