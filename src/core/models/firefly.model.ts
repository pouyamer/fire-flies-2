import { Shape } from "../enums";
import { ShapeValue } from "../types";
import { ChangingNumericalValueItem } from "./changing-numerical-value-item.model";

export class Firefly {
  key: string | null;
  hue: ChangingNumericalValueItem;
  size: ChangingNumericalValueItem;
  saturation: ChangingNumericalValueItem;
  lightness: ChangingNumericalValueItem;
  alpha: ChangingNumericalValueItem;
  speedX: ChangingNumericalValueItem;
  speedY: ChangingNumericalValueItem;
  polarSpeedAngle: ChangingNumericalValueItem;
  polarSpeedAmount: ChangingNumericalValueItem;
  shapeValue: ShapeValue;
  jitterX: ChangingNumericalValueItem;
  jitterY: ChangingNumericalValueItem;
  jitterPolarAngle: ChangingNumericalValueItem;
  jitterPolarAmount: ChangingNumericalValueItem;
  x: number;
  y: number;
  initialFireflySnapshot: Firefly | null;
  rotatedAngle: number;
  rotateSpeed: number;
  rotateAcceleration: number;
  firefliesInCollision: Firefly[];
  drawMethod: 'fill' | 'stroke';
  life: number;
  neighboredBy: Firefly | null;
  neighbors: Firefly[];
  beforeEnteringNeighborhoodSnapshot: Firefly | null;
  strokeLineWidth: number;


  constructor(model: Partial<Firefly> = {}) {
    this.key = model.key ?? null;
    this.shapeValue = model.shapeValue ?? Shape.Circle;
    this.size = model.size ?? new ChangingNumericalValueItem();
    this.hue = model.size ?? new ChangingNumericalValueItem();
    this.saturation = model.saturation ?? new ChangingNumericalValueItem();
    this.lightness = model.lightness ?? new ChangingNumericalValueItem();
    this.alpha = model.alpha ?? new ChangingNumericalValueItem();
    this.x = model.x ?? 0;
    this.y = model.y ?? 0;
    this.initialFireflySnapshot = {
      ...this,
      initialFireflySnapshot: null,
    }
    this.speedX = model.speedX ?? new ChangingNumericalValueItem();
    this.speedY = model.speedY ?? new ChangingNumericalValueItem();
    this.polarSpeedAngle = model.polarSpeedAngle ?? new ChangingNumericalValueItem();
    this.polarSpeedAmount = model.polarSpeedAmount ?? new ChangingNumericalValueItem();
    this.rotatedAngle = model.rotatedAngle ?? 0;
    this.rotateSpeed = model.rotateSpeed ?? 0;
    this.rotateAcceleration = model.rotateAcceleration ?? 0;
    this.jitterX = model.jitterX ?? new ChangingNumericalValueItem();
    this.jitterY = model.jitterY ?? new ChangingNumericalValueItem();
    this.jitterPolarAmount = model.jitterPolarAmount ?? new ChangingNumericalValueItem();
    this.jitterPolarAngle = model.jitterPolarAngle ?? new ChangingNumericalValueItem();
    this.firefliesInCollision = model.firefliesInCollision ?? [];
    this.neighboredBy = model.neighboredBy ?? null;
    this.neighbors = model.neighbors ?? [];
    this.beforeEnteringNeighborhoodSnapshot = null;
    this.drawMethod = model.drawMethod ?? 'fill';
    this.life = model.life ?? Infinity;
    this.strokeLineWidth = model.strokeLineWidth ?? 1;
  }

}