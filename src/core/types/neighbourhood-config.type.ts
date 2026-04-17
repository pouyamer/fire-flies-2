import { Firefly } from "../models";
import { FireflyAppApiGetter } from "./app-services.type";
import { EventCallBackWithFirefly } from "./event-callback.type";

export type FireflyNeighbourhoodPicker = (
  candidate: Firefly,
  fireflies: Firefly[]
) => Firefly[];


export type NeighbourhoodConfig  = {
  // type static: once the set runs
  // type reactive: runs every tick
  candidatePickingStrategy: 'static' | 'reactive';
  candidatePicker: (api: FireflyAppApiGetter) => Firefly[];
  // how candidates select their neighbourhood
  neighbourPicker: FireflyNeighbourhoodPicker;
  // default value: false, 
  canPickCandidates: boolean;
  // default value: false
  canPickNeighboursFromOtherCandidates: boolean;
  // events:
  onNeighbourhoodEnter?: EventCallBackWithFirefly;
  onNeighbourhood?: EventCallBackWithFirefly;
  onNeighbourhoodExit?: EventCallBackWithFirefly;
  // it's recommended not to use it and handle a global case in where its defined
  onNotInNeighbourhood?: EventCallBackWithFirefly;

  onCandidatePicked?: EventCallBackWithFirefly;
  onCandidateDismissed?: EventCallBackWithFirefly
}