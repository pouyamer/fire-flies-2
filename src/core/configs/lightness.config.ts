import { ChangeType, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const lightnessConfig: ChangingValueConfig = {
  name: ServiceName.Lightness,
  type: ChangeType.NoChange,
  value: 60,
}