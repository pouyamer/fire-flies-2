import { Color, Range } from "../models";
import { PossibleValue, ValueGenerator, ValueGeneratorParameters, WeightedValue } from "../types";

export class Utilities {

  public static isRange(target: unknown): target is Range {
    return (
      target !== null &&
      typeof target === "object" &&
      "min" in target &&
      "max" in target
    )
  }

  public static range(min: number, max: number): Range {
    return {
      min, max
    }
  }

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

  public static isNumberArray(target: unknown):  target is number[] {
    return (
      target !== null &&
      Array.isArray(target) &&
      target.every(v => typeof v === "number")
    );
  }

  public static isRangeArray(target: unknown): target is Range[] {
    return (
      target !== null &&
      Array.isArray(target) &&
      target.every(v => this.isRange(v))
    )
  }

  public static getNonNumericValue<T>(
    rawValue: T | T[]
  ): T;
  public static getNonNumericValue<T>(
    rawValue: ValueGenerator<T>,
    valueGeneratorArgs: ValueGeneratorParameters
  ): T
  public static getNonNumericValue<T>(
    rawValue: PossibleValue<T>,
    valueGeneratorArgs?: ValueGeneratorParameters
  ): T {
    if (Array.isArray(rawValue)) {
      return Utilities.chooseBetweenMultipleValues(rawValue);
    }
   else if (typeof rawValue === "function") {
      return rawValue(valueGeneratorArgs as ValueGeneratorParameters);
   }
   else {
    return rawValue as T; 
   }
  }

  public static getNumericValue(
    rawValue: number | Range | number[] | Range[] | WeightedValue<number>[],
  ): number
  public static getNumericValue(
    rawValue: Range,
    getAsInteger: boolean,
  ): number
  public static getNumericValue(
    rawValue: ValueGenerator<number>,
    valueGeneratorArgs: ValueGeneratorParameters
  ): number;
  public static getNumericValue(
    rawValue: PossibleValue<number>,
    secondArgument?: boolean | ValueGeneratorParameters
  ): number {
    if (typeof rawValue === "number") {
      return rawValue;
    }
    else if (this.isRange(rawValue)) {
      // Range
      return secondArgument && typeof secondArgument === "boolean"
        ? Utilities.getRandomNumberBetween(rawValue, secondArgument)
        : Utilities.getRandomNumberBetween(rawValue)
    }
    else if (Array.isArray(rawValue)) {
      // if it is Range then it should be handled by Range mode
      const chosenValue: Range | number = rawValue.every(v => typeof v === "number" || this.isRange(v))
        ? this.chooseBetweenMultipleValues<Range | number>(rawValue)
        : this.getValueFromWeightedValues(rawValue);

      return typeof chosenValue === "number"
        ? chosenValue
        : this.getNumericValue(chosenValue)
        
    }
    else if (!this.isRange(rawValue) && secondArgument && typeof secondArgument !== "boolean") {
      const valueFromGenerator = rawValue(
        secondArgument
      );

      return typeof valueFromGenerator === "number" ? valueFromGenerator : this.getNumericValue(valueFromGenerator)
    }
    else {
      return 0;
    }
  }

  public static chooseBetweenMultipleValues<T>(values: T[]): T {
    const index = Utilities.getRandomNumberBetween({
      min: 0,
      max: values.length - 1
    }, true)

    return values[index]
  }

  public static getValueFromWeightedValues<T>(values: WeightedValue<T>[]): T {
  if (values.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  
  // Calculate total weight
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  
  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than 0');
  }
  
  // Generate random number between 0 and totalWeight
  const random = Math.random() * totalWeight;
  
  // Find the selected item
  let accumulatedWeight = 0;
  
  for (const item of values) {
    accumulatedWeight += item.weight;
    if (random <= accumulatedWeight) {
      return item.value;
    }
  }
  
  // Fallback (should theoretically never reach here)
  return values[values.length - 1].value;
}
}
