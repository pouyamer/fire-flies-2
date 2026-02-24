import { ChangingValueConfig } from "./changing-value-config.type";

export type JitterConfig = {
  jitterX: ChangingValueConfig;
  jitterY: ChangingValueConfig;
  jitterPolarAngle: ChangingValueConfig;
  jitterPolarAmount: ChangingValueConfig;
}