import { Range } from "../models";
import { ValueGenerator } from "./genarator-callback.type";

export type PossibleValue<T> = T extends number 
  ? T | Range | ValueGenerator<T> | T[] 
  : T | ValueGenerator<T> | T[];

// TODO: Add 