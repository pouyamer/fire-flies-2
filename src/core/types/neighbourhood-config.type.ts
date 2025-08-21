import { Firefly } from "../models";
import { ValueGenerator, ValueGeneratorParameters } from "./genarator-callback.type";

export type FireflyNeighbourhoodPicker = (
  candidate: Firefly,
  fireflies: Firefly[]
) => Firefly[];


export type NeighbourhoodConfig  = {
  candidatePicker: (parameters: Omit<ValueGeneratorParameters, "currentFirefly">) => Firefly[];
  // how candidates select their neighbourhood
  neighbourPicker: FireflyNeighbourhoodPicker;
}