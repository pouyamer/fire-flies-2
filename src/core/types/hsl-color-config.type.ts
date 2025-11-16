import { ChangingValueConfig } from "./changing-value-config.type"

type ColorNumberValues = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

export type HslColorConfig = {
  hue: ChangingValueConfig,
  saturation: ChangingValueConfig,
  lightness: ChangingValueConfig;
  alpha: ChangingValueConfig;
  colorBinder?: (options: ColorNumberValues) => Partial<ColorNumberValues>;
}