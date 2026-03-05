import { Hsl, Rgb } from "../types";

export class HslColor implements Hsl<number> {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(model: Partial<HslColor> = {}) {
    this.hue = model.hue ?? 0;
    this.saturation = model.saturation ?? 0;
    this.lightness = model.lightness ?? 0;
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

  constructor(model: Partial<RgbColor> = {}) {
    this.red = model.red ?? 0;
    this.green = model.green ?? 0;
    this.blue = model.blue ?? 0;
    this.alpha = model.alpha ?? 1;
  }

  toString(): string {
    const color = new RgbColor(this)
    return `rgb(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`
  }
}