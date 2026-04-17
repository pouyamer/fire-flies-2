import { Range } from "../models";
import { ValueGeneratorWithFirefly } from "./genarator-callback.type";

// possible value for number and non-number
type PossibleSharedValue<T> = T | T[] | ValueGeneratorWithFirefly<T | T[] | WeightedValue<T>[]> | WeightedValue<T>[]

export type WeightedValue<T> = {
  value: T,
  weight: number
}

export type PossibleValue<T> = T extends number 
  ? Range | Range[] | ValueGeneratorWithFirefly<Range | Range[]> | PossibleSharedValue<T>
  : PossibleSharedValue<T>;

// TODO: Add 