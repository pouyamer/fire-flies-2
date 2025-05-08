import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifier: GlobalFireflyModifierConfig = {
    onSetModifier: ({fireflies, canvas}) => {
        // fireflies[0].x = 200;
        // fireflies[1].x = canvas.width - 200;
        // fireflies[1].speedX = -1;
        // fireflies[0].speedX = 1;
    },
    onFramePassModifier: ({currentFirefly: ff}) => {
        ff.size.value += Math.random() * .1

        ff.speedY = -ff.size.value / 7
    }
}