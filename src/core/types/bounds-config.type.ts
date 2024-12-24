import { BaseConfig } from "./base-config.type";
import { EventCallBack } from "./event-callback.type";
import { GeneratorValueOnCanvasCallback } from "./genarator-callback.type";

type BoundSetter = {
  setter: GeneratorValueOnCanvasCallback<number | null>;
}

type BaseBoundCallBacks = {
  type: "touched-bounds"
  onTouchedBounds?: EventCallBack | null;
} | {
  type: "out-of-bounds",
  onOutOfBounds?: EventCallBack | null;
} ;

type BoundOnlySetterCallBack = BoundSetter & {
  type: "only-setter",
}

type BoundCallbacks = BoundSetter & BaseBoundCallBacks;

export type BoundsConfig = BaseConfig & {
  left?: BoundCallbacks | BoundOnlySetterCallBack,
  right?: BoundCallbacks | BoundOnlySetterCallBack,
  top?: BoundCallbacks | BoundOnlySetterCallBack,
  bottom?: BoundCallbacks | BoundOnlySetterCallBack;
  // general (if any bound)
  general: BaseBoundCallBacks;
} 