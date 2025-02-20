import { Range } from "../models";
import { ValueGenerator } from "./genarator-callback.type";

// possible value for number and non-number
type PossibleSharedValue<T> = T | T[] | ValueGenerator<T | T[]>

export type PossibleValue<T> = T extends number 
  ? Range | Range[] | ValueGenerator<Range | Range[]> | PossibleSharedValue<T> 
  : PossibleSharedValue<T>;

// TODO: Add 