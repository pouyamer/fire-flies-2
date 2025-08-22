import { CONSTANTS } from "../constants/constants";
import { NeighbourhoodConfig } from "../types";

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePickingStrategy: "reactive",
  candidatePicker: ({fireflies}) =>  fireflies.filter((_, i) => i  <100),
  neighbourPicker: CONSTANTS.NEIGHBOUR_PICKERS.Circle(300),
  canPickCandidates: false,
  canPickNeighboursFromOtherCandidates: false,
  onNeighbourhoodEnter: () => {},
  onNeighbourhood: CONSTANTS.EVENT_CALLBACKS.BlackHole(10, 0),
  onNeighbourhoodExit: () => {},
  onNotInNeighbourhood: () => {},
  onCandidatePicked: ({currentFirefly: ff}) => {
  },
  onCandidateDismissed: ({currentFirefly: ff}) => { ff.hue.value = 100}
}