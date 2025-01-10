import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifier: GlobalFireflyModifierConfig = {
    onFramePassModifier: ({currentFirefly}) => {
        currentFirefly.size.value = (1 - currentFirefly.alpha.value) * 20
    }
}