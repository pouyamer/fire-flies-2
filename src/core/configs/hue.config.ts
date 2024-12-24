import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const hueConfig: ChangingValueConfig = {
  name: ServiceName.Hue,
  type: ChangeType.NoChange,
  value: (ff) => ff.speedX * 120
  
}