import { BoundaryRule, CartesianType, EventCallBackWithFirefly, FireflyAppApi } from "../types"
import { FireflyCanvas } from "./firefly-canvas.model";
import { Firefly } from "./firefly.model";

type Constructor = {
  key: string;
  touchedRule: BoundaryRule;
  outRule: BoundaryRule;
  excludedFireflies: Firefly[];
  touchedPositionCorrector?: EventCallBackWithFirefly;
  onTouched?: EventCallBackWithFirefly;
  onOut?: EventCallBackWithFirefly;
}



export class Boundary {
  private _key: string = '';
  touchedRule: BoundaryRule;
  outRule: BoundaryRule;
  excludedFireflies: Firefly[] = [];
  touchedPositionCorrector?: EventCallBackWithFirefly;
  onTouched?: EventCallBackWithFirefly;
  onOut?: EventCallBackWithFirefly;

  constructor(model: Constructor) {
    this._key = model.key;
    this.touchedRule = model.touchedRule;
    this.outRule = model.outRule;
    this.excludedFireflies = model.excludedFireflies;
    this.touchedPositionCorrector = model.touchedPositionCorrector;
    this.onTouched = model.onTouched;
    this.onOut = model.onOut;
  }

  private get key() {
    return this._key;
  }
}