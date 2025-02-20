import { AccelerationType, ServiceName } from "../enums";
import { AccelerationConfig } from "../types";

export const accelerationConfig: AccelerationConfig = {
  name: ServiceName.Acceleration,
  type: AccelerationType.PolarInDirection,
  acc: 0.003
}
