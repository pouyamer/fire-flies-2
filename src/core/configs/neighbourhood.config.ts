import { CONSTANTS } from "../constants/constants";
import { NeighbourhoodConfig } from "../types";

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePickingStrategy: "reactive",
  canPickCandidates: false,
  canPickNeighboursFromOtherCandidates: false,
  candidatePicker: () => [],
  neighbourPicker: () => [],
  onNeighbourhoodEnter: () => {},
  onNeighbourhood: () => {},
  onNeighbourhoodExit: () => {},
  onNotInNeighbourhood: () => {},
  onCandidatePicked: () => {},
  onCandidateDismissed: () => {}
}