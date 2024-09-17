import { Firefly } from "../models";

export interface Service {
  set: (firefly: Firefly) => void,
  execute: (firefly: Firefly) => void,
}