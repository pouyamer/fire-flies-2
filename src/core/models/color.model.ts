import { Hsl, HslWithoutAlpha, Rgb, RgbWithoutAlpha } from "../types";

export class HslColor implements Hsl<number> {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(model: HslWithoutAlpha<number>) {
    this.hue = model.hue;
    this.saturation = model.saturation;
    this.lightness = model.lightness;
    this.alpha = model.alpha ?? 1;
  }

  toString(): string {
    const color = new HslColor(this)
    return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`
  }
}

export class RgbColor implements Rgb<number> {
  red: number;
  green: number;
  blue: number;
  alpha: number;

  constructor(model: RgbWithoutAlpha<number>) {
    this.red = model.red;
    this.green = model.green;
    this.blue = model.blue;
    this.alpha = model.alpha ?? 1;
  }

  toString(): string {
    const color = new RgbColor(this)
    return `rgb(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`
  }
}