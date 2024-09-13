import { Firefly } from "../models";

export interface Service {
  execute: () => void,
  fireflies: Firefly[];
}