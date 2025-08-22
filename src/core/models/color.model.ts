export class Color {
  hue: number;
  saturation: number;
  lightness: number;
  alpha?: number;

  constructor(model: Partial<Color> = {}) {
    this.hue = model.hue ?? 0;
    this.saturation = model.saturation ?? 0;
    this.lightness = model.lightness ?? 0;
    this.alpha = model.alpha ?? 1;
  }

  toString(): string {
    const color = new Color(this)
    return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`
  }
}