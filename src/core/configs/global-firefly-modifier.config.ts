import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifier: GlobalFireflyModifierConfig = {
    onSetModifier: ({fireflies, canvas}) => {
        // fireflies[0].x = 200;
        // fireflies[1].x = canvas.width - 200;
        // fireflies[1].speedX = -1;
        // fireflies[0].speedX = 1;
    },
    onFramePassModifier: ({currentFirefly: ff}) => {
        ff.size.value = ff.size.value * .99
        ff.alpha.value = ff.alpha.value * .99
    }
}