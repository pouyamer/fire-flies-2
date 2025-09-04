import { CONSTANTS } from "../constants/constants";
import { NeighbourhoodConfig } from "../types";

export const neighbourhoodConfig: NeighbourhoodConfig = {
  candidatePickingStrategy: "static",
  canPickCandidates: false,
  canPickNeighboursFromOtherCandidates: false,
  candidatePicker: () => [],
  neighbourPicker: CONSTANTS.NEIGHBOUR_PICKERS.Circle(100),
  onNeighbourhoodEnter: ({currentFirefly, app}) => {
    currentFirefly.speedX = -.1 *  currentFirefly.speedX 
    currentFirefly.speedY = -.1 * currentFirefly.speedY
    currentFirefly.hue.value = 100;


  },
  onNeighbourhood: ({currentFirefly, app}) => { 
    currentFirefly.life += 12;

  },
  onNeighbourhoodExit: () => {},
  onNotInNeighbourhood: () => {},
  onCandidatePicked: ({currentFirefly}) => {currentFirefly.lightness.value = 100},
  onCandidateDismissed: () => {}
}