import { Firefly } from "../models";
import { FireflyNeighbourhoodPicker, NeighbourhoodConfig } from "../types";
import { Utilities } from "../utilities";

const pickNeighbourFirefliesInRadius = (r: number): FireflyNeighbourhoodPicker => {
  return (ff, ffs) => {
    return ffs.filter(f => Utilities.calculateDistance(f.x, f.y, ff.x, ff.y) <= r)
  }
}

const pickNeighbourFirefliesInRectangle = (width: number, height: number): FireflyNeighbourhoodPicker => {
  return (ff, ffs) => {
    return ffs.filter(f => (
      Math.abs(f.x - ff.x) < width &&
      Math.abs(f.y - ff.y) < height
    ))
  }
}

const pickNeighbourFirefliesInSquare = (width: number): FireflyNeighbourhoodPicker => {
  return pickNeighbourFirefliesInRectangle(width, width)
}

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePicker: ({fireflies}) => { return fireflies.filter((_, i) => i < 1)},
  neighbourPicker: pickNeighbourFirefliesInRadius(100)
}