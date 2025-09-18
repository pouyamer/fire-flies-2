import { EventCallBack } from "./event-callback.type"

export type WindowConfig = {
  // Default = 0
  mousePositionFuzziness: number;
  // TODO: later offset for the position of the canvas
  onFireflyMouseOver?: EventCallBack;
  onFireflyMouseLeave?: EventCallBack;
  onFireflyMouseEnter?: EventCallBack
}