import { ChangingValueConfig } from "./changing-value-config.type"

export type HslColorConfig = {
  hue: ChangingValueConfig,
  saturation: ChangingValueConfig,
  lightness: ChangingValueConfig;
  alpha: ChangingValueConfig;
}