import { ChangingValueConfig } from "./changing-value-config.type";
import { Hsl } from "./hsl-color-config.type";
import { Rgb } from "./rgb-color.config.type";

type ColorSpace = 'rgb' | 'hsl';

export type ColorConfig<
  TColorSpace extends ColorSpace
> = ColorValue<
  TColorSpace,
  ChangingValueConfig
> & {
  colorBinder?: (options: ColorValue<TColorSpace, number>) => Partial<ColorValue<TColorSpace, number>>;
}

type ColorValue<
  TColorSpace extends ColorSpace,
  T
> = TColorSpace extends 'rgb' ? Rgb<T> : Hsl<T>;

export type ColorValueWithoutAlpha<
  TColorSpace extends ColorSpace,
  T
> = Omit<ColorValue<TColorSpace, T>, 'alpha'> & { alpha?: T }

export type DescriminatedColor<T> =
  ({type: 'rgb'} & Rgb<T>) |
  ({type: 'hsl'} & Hsl<T>) 