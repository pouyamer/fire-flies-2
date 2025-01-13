import { ChangeType, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const hueConfig: ChangingValueConfig = {
  name: ServiceName.Hue,
  type: ChangeType.NoChange,
  value: [0,100]
  
}