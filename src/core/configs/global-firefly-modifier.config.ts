import { GlobalFireflyModifierConfig } from "../types";
import { Utilities } from "../utilities";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: () => {},
  onFramePassModifier: ({firefly, fireflies}) => {
    if (firefly.size.value <= 1) {
      // firefly.lightness.value = 100

      // const selectedNeighbour = fireflies.find(ff => ff.size.value > 10 && Utilities.calculateDistance(ff, firefly) <= 100);
      // if (selectedNeighbour) {
      //   firefly.size.value = 12

      //   selectedNeighbour.lightness.value = 65;
      //   selectedNeighbour.hue.value = 0;

      // }

    }
  }
}