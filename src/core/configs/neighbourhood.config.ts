import { NeighbourhoodConfig } from "../types";

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePickingStrategy: "static",
  canPickCandidates: false,
  canPickNeighboursFromOtherCandidates: false,
  candidatePicker: () => [],
  neighbourPicker: () => [],
  onNeighbourhoodEnter: () => {},
  onNeighbourhood: () => { },
  onNeighbourhoodExit: () => {},
  onNotInNeighbourhood: () => {},
  onCandidatePicked: () => {},
  onCandidateDismissed: () => {}
}