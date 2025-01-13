import { LocationConfig } from "../types";

export const locationConfig: LocationConfig = {
  x: ({canvas}) => {
    return Math.random() * canvas.width ;
  },
  y: ({canvas}) => {
    return Math.random() * canvas.height;
  }
}