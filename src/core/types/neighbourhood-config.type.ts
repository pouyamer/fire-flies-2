import { Firefly } from "../models";
import { EventCallBack } from "./event-callback.type";
import { ValueGeneratorParameters } from "./genarator-callback.type";

export type FireflyNeighbourhoodPicker = (
  candidate: Firefly,
  fireflies: Firefly[]
) => Firefly[];


export type NeighbourhoodConfig  = {
  // type static: once the set runs
  // type reactive: runs every tick
  candidatePickingStrategy: 'static' | 'reactive';
  candidatePicker: (parameters: Omit<ValueGeneratorParameters, "currentFirefly">) => Firefly[];
  // how candidates select their neighbourhood
  neighbourPicker: FireflyNeighbourhoodPicker;
  // default value: false, 
  canPickCandidates: boolean;
  // default value: false
  canPickNeighboursFromOtherCandidates: boolean;
  // events:
  onNeighbourhoodEnter?: EventCallBack;
  onNeighbourhood?: EventCallBack;
  onNeighbourhoodExit?: EventCallBack;
  // it's recommended not to use it and handle a global case in where its defined
  onNotInNeighbourhood?: EventCallBack;

  onCandidatePicked?: EventCallBack;
  onCandidateDismissed?: EventCallBack
}