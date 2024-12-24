import { BaseConfig } from "./base-config.type";
import { PossibleValue } from "./possible-value.type";

type BaseLocationConfig = {
    x: PossibleValue,
    y: PossibleValue,
  }
export type LocationConfig = BaseConfig & BaseLocationConfig;

