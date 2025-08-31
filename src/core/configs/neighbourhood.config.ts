import { CONSTANTS } from "../constants/constants";
import { NeighbourhoodConfig } from "../types";

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePickingStrategy: "reactive",
  canPickCandidates: false,
  canPickNeighboursFromOtherCandidates: false,
  candidatePicker: ({fireflies}) =>  {
    return [fireflies[0]]
  },
  neighbourPicker: CONSTANTS.NEIGHBOUR_PICKERS.Circle(400),
  onNeighbourhoodEnter: () => {},
  onNeighbourhood: ({currentFirefly}) => {
    currentFirefly.hue.value = 330
  },
  onNeighbourhoodExit: ({currentFirefly}) => {
        currentFirefly.hue.value = 20
  },
  onNotInNeighbourhood: () => {},
  onCandidatePicked: () => {},
  onCandidateDismissed: () => {}
}