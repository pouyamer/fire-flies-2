import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: ({currentFirefly}) => {
    currentFirefly.hue.value = currentFirefly.x
  },
  onFramePassModifier: () => {}
}