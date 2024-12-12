import { ServiceName } from "../enums";
import { AccelerationConfig } from "./acceleration-config.type";
import { BoundsConfig } from "./bounds-config.type";
import { ChangingValueConfig } from "./changing-value-config.type";
import { LocationConfig } from "./location-config.type";
import { ShapeConfig } from "./shape-config.type";
import { SpeedConfig } from "./speed-config.type";
import { WindowConfig } from "./window-config.type";

export type ServiceMap = {
  name: ServiceName,
  config?: ChangingValueConfig | SpeedConfig | AccelerationConfig | ShapeConfig | LocationConfig | BoundsConfig | WindowConfig,
}
