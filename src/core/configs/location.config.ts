import { CONSTANTS } from "../constants/constants";
import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  ...CONSTANTS.randomCanvasLocationWithSegments(30, 10)
}