import { v4 } from "uuid";
import { LifeConfig } from "../types";

export const lifeConfig: LifeConfig = {
  value: 1000,
  codeGenerator: () => v4(),
  nextValueFn: ({currentFirefly}) => currentFirefly.life - Math.random(),
}