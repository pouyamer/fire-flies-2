import { PossibleValue } from "./possible-value.type";

type BaseLocationConfig = {
    x: PossibleValue<number>,
    y: PossibleValue<number>,
  }
export type LocationConfig = BaseLocationConfig;

