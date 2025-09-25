import { v4 } from "uuid";
import { LifeConfig } from "../types";

export const lifeConfig: LifeConfig = {
  value: Infinity,
  codeGenerator: () => v4(),
}