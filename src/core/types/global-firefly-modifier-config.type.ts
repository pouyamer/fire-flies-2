import { EventCallBack, EventCallBackWithFirefly } from "./event-callback.type"

export type GlobalFireflyModifierConfig = {
    setOne?: EventCallBackWithFirefly;
    updateOne?: EventCallBackWithFirefly;
    set?: EventCallBack;
    update?: EventCallBack
}