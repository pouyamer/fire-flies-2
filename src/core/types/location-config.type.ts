import { BaseConfig } from "./base-config.type";
import { PossibleValue } from "./possible-value.type";

type BaseLocationConfig = {
    x: PossibleValue<number>,
    y: PossibleValue<number>,
  }
export type LocationConfig = BaseConfig & BaseLocationConfig;

