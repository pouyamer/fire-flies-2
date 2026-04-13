import { ColorConfig, ColorValueWithoutAlpha } from "./color.type";

export type Hsl<T> = {
  hue: T;
  saturation: T;
  lightness: T;
  alpha: T;
}

export type HslColorConfig = ColorConfig<'hsl'>;
export type HslWithoutAlpha<T> = ColorValueWithoutAlpha<'hsl', T>;
