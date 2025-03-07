import { ChangeType, ServiceName } from "../enums";
import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  name: ServiceName.Size,
  type: ChangeType.NoChange,
  value: {
    min: 3,
    max: 9
  },
}