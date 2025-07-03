import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
    onSetModifier: ({fireflies, canvas}) => {
        // fireflies[0].x = 200;
        // fireflies[1].x = canvas.width - 200;
        // fireflies[1].speedX = -1;
        // fireflies[0].speedX = 1;
    },
    onFramePassModifier: ({currentFirefly: ff}) => {
    }
}