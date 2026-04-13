import { ColorConfig, ColorValueWithoutAlpha } from "./color.type";

export type Rgb<T> = {
  red: T;
  green: T;
  blue: T;
  alpha: T;
}


export type RgbWithoutAlpha<T> = ColorValueWithoutAlpha<'rgb', T>;

export type RgbColorConfig = ColorConfig<'rgb'>