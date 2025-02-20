import { EventCallBack } from "./event-callback.type"

export type GlobalFireflyModifierConfig = {
    onSetModifier?: EventCallBack,
    onFramePassModifier: EventCallBack,
}