import { ChangeType, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const saturationConfig: ChangingValueConfig = {
  name: ServiceName.Saturation,
  type: ChangeType.NoChange,
  value: 90,
}