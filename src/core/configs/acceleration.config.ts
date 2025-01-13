import { AccelerationType, ServiceName } from "../enums";
import { AccelerationConfig } from "../types";

export const accelerationConfig: AccelerationConfig = {
  name: ServiceName.Acceleration,
  type: AccelerationType.Cartesian,
  accX: 0,
  accY: 0.03
}
