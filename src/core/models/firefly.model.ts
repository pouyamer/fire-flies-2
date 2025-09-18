import { Shape, SpeedType } from "../enums";
import { Service } from "../interfaces";
import { DrawConfig, ShapeValue } from "../types";
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
  x: number;
  y: number;
  initialFireflySnapshot: Firefly | null;
  activeServices: Service[];
  rotatedAngle: number;
  rotateSpeed: number;
  rotateAcceleration: number;
  jitterX: number;
  jitterY: number;
  firefliesInCollision: Firefly[];
  drawMethod: DrawConfig['method'];
  life: number;
  neighboredBy: Firefly | null;
  neighbors: Firefly[];
  beforeEnteringNeighborhoodSnapshot: Firefly | null;


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
    this.speedX = model.speedX ?? new ChangingNumericalValueItem;
    this.speedY = model.speedY ?? new ChangingNumericalValueItem;
    this.polarSpeedAngle = model.polarSpeedAngle ?? new ChangingNumericalValueItem;
    this.polarSpeedAmount = model.polarSpeedAmount ?? new ChangingNumericalValueItem;
    this.rotatedAngle = model.rotatedAngle ?? 0;
    this.rotateSpeed = model.rotateSpeed ?? 0;
    this.rotateAcceleration = model.rotateAcceleration ?? 0;
    this.jitterX = model.jitterX ?? 0;
    this.jitterY = model.jitterY ?? 0;
    this.activeServices = model.activeServices ?? [];
    this.firefliesInCollision = model.firefliesInCollision ?? [];
    this.neighboredBy = model.neighboredBy ?? null;
    this.neighbors = model.neighbors ?? [];
    this.beforeEnteringNeighborhoodSnapshot = null;
    this.drawMethod = model.drawMethod ?? 'fill';
    this.life = model.life ?? Infinity;
  }

}