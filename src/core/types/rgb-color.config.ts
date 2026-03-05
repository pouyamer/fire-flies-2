import { ChangingValueConfig } from "./changing-value-config.type";

export type Rgb<T> = {
  red: T;
  green: T;
  blue: T;
  alpha: T;
}

export type RgbColorConfig = Rgb<ChangingValueConfig> & {
  colorBinder?: (options: Rgb<number>) => Partial<Rgb<number>>;
}