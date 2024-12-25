import { Range } from "../models";
import { ValueGenerator } from "./genarator-callback.type";

export type PossibleValue = number | Range | ValueGenerator<number> | number[]

// TODO: Add 