import { ChangingNumericalValueItem, Firefly } from "../models";

export type ChangingValueKey<T extends Firefly = Firefly> = {
  [K in keyof T]: T[K] extends ChangingNumericalValueItem ? K : never;
}[keyof T];