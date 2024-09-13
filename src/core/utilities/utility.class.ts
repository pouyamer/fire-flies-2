import { Color, Range } from "../models";

export class Utilities {

  public static hslColorToString = (color: Color): string => {
    const { hue, lightness, saturation, alpha } = color;

    return `hsl(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
  }


  public static isObject = (item: object) =>
    item && typeof item === "object" && !Array.isArray(item)

  public static deepMerge = (target: any, source: any) => {
    let output = Object.assign({}, target)
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] })
          else output[key] = this.deepMerge(target[key], source[key])
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
    return output
  }

  public static getRandomNumberBetween = (
    range: Range,
    getAsInteger?: boolean
  ) => {
    const { min, max } = range
    return getAsInteger
      ? Math.floor(Math.random() * (max - min + 1)) + min
      : Math.random() * (max - min) + min
  }

  public static calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  }

  public static getSign(input: number): number {
    if (input < 0) return -1
    if (input > 0) return 1
    return 0
  }

  public static getValue(
    rawValue: Range | number,
    getAsInteger?: boolean
  ): number {
    if (typeof rawValue === "number") {
      return rawValue;
    }
    else {
      return Utilities.getRandomNumberBetween(rawValue, getAsInteger)
    }
  }
}
