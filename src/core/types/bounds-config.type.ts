import { EventCallBack } from "./event-callback.type";
import { GeneratorValueOnCanvasCallback } from "./genarator-callback.type";

type DirectionalTyped<T> = {
  left?: T;
  right?: T;
  top?: T;
  bottom?: T;
}

type BoundsConfigEvent = (Partial<DirectionalTyped<EventCallBack>> & {all?: EventCallBack}) |
  EventCallBack

export type Direction = 'top' | 'bottom' | 'left' | 'right'

export type BoundsConfig =
  Partial<DirectionalTyped<number | GeneratorValueOnCanvasCallback<number>>> &
{
  // when ON it corrects the offset of position of firefly when it goes out of bounds due to frames
  // note that when this is on outofbounds never gets triggered for that direction
  applyPositionCorrection?: Partial<DirectionalTyped<boolean>>;
  onFireflyOutOfBounds?: BoundsConfigEvent;
  onFireflyTouchedBounds?: BoundsConfigEvent;
}