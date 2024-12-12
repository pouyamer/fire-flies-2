import { LocationSetMethod, ServiceName } from "../enums";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  name: ServiceName.Location,
  type: LocationSetMethod.CenterOfCanvas,
}