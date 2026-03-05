import { ChangingValueConfig } from "./changing-value-config.type"

export type Hsl<T> = {
  hue: T;
  saturation: T;
  lightness: T;
  alpha: T;
}

export type HslColorConfig = Hsl<ChangingValueConfig> & {
  colorBinder?: (options: Hsl<number>) => Partial<Hsl<number>>;
}