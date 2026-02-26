import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: () => {},
  onFramePassModifier: ({firefly, canvas}) => {

    if (canvas.mouseX && canvas.mouseY && Math.random() < .4){
      firefly.x = canvas.mouseX ?? 0;
      firefly.y = canvas.mouseY ?? 0;
    }
  }
}