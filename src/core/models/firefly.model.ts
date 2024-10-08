import { Shape } from "../enums";
import { ChangingNumericalValueItem } from "./changing-numerical-value-item.model";

export class Firefly {
  accelerationX: number;
  accelerationY: number;
  key: string | null;
  hue: ChangingNumericalValueItem;
  size: ChangingNumericalValueItem;
  saturation: ChangingNumericalValueItem;
  lightness: ChangingNumericalValueItem;
  alpha: ChangingNumericalValueItem;
  shape: Shape;
  sideCount: number;
  pointCount: number;
  speedX: number;
  speedY: number;
  x: number;
  y: number;
  // moving angle gets cached to be used in acceleration service
  movingAngle: number;


  constructor(model: Partial<Firefly> = {}) {
    this.accelerationX = model.accelerationX ?? 0;
    this.accelerationY = model.accelerationY ?? 0;
    this.key = model.key ?? null;
    this.movingAngle = model.movingAngle ?? 0;
    this.shape = model.shape ?? Shape.Circle;
    this.sideCount = model.sideCount ?? 3;
    this.pointCount = model.pointCount ?? 3;
    this.size = model.size ?? new ChangingNumericalValueItem();
    this.hue = model.size ?? new ChangingNumericalValueItem();
    this.saturation = model.saturation ?? new ChangingNumericalValueItem();
    this.lightness = model.lightness ?? new ChangingNumericalValueItem();
    this.alpha = model.alpha ?? new ChangingNumericalValueItem();
    this.speedX = model.speedX ?? 0;
    this.speedY = model.speedY ?? 0;
    this.x = model.x ?? 0;
    this.y = model.y ?? 0;
  }

}