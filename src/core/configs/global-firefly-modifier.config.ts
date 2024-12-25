import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifier: GlobalFireflyModifierConfig = {
    onFramePassModifier: (ff, c) => {
        ff.size.value = (1 - ff.alpha.value) * 20
    }
}