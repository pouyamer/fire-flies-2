import { PossibleValue } from "./possible-value.type";

export type RotationConfig = {
  speed_PI: PossibleValue<number>;
  startingAngle: PossibleValue<number>;
  acceleration_PI: PossibleValue<number>;
}