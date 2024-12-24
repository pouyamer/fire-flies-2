import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifier: GlobalFireflyModifierConfig = {
    onFramePassModifier: (ff, c) => {
        ff.speedX += .02;
        ff.hue.value = ff.x/20
    }
}