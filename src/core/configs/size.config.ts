import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { Firefly } from "../models";
import { ChangingValueConfig } from "../types";

export const sizeConfig: ChangingValueConfig = {
  name: ServiceName.Size,
  type: ChangeType.NoChange,
  value: {
    min: 10,
    max: 15
  },
}