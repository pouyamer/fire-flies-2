import { LocationConfig } from "../types";
import { Utilities } from "../utilities";

export const locationConfig: LocationConfig = {
  x: ({fireflies, firefly}) => {
    return fireflies.findIndex(ff => firefly === ff) * 100 + 500
  },
  y: ({canvas}) => (canvas.height / 2) + Utilities.getRandomNumberBetween(Utilities.range(200)),
}