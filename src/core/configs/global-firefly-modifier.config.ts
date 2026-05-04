import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  updateOne: ({api, firefly}) => {
    const canvas = api('canvas');


    if (canvas.mouseX && canvas.mouseY ) {
      firefly.x = canvas.mouseX;
      firefly.y = canvas.mouseY;
    }
  }
}