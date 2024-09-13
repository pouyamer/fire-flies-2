import { Shape } from "../types/shape.type";
import { Color } from "./color.model";

export class Firefly {
  color: Color;
  key: string | null;
  x: number;
  y: number;
  size: number;
  shape: Shape;
  speedX: number;
  speedY: number;
  accelerationX: number;
  accelerationY: number;
  // moving angle gets cached to be used in acceleration service
  movingAngle: number;

  constructor(model: Partial<Firefly> = {}) {
    this.color = model.color ?? new Color();
    this.key = model.key ?? null;
    this.x = model.x ?? 0;
    this.y = model.y ?? 0;
    this.size = model.size ?? 1;
    this.shape = model.shape ?? "circle";
    this.speedX = model.speedX ?? 0;
    this.speedY = model.speedY ?? 0;
    this.accelerationX = model.accelerationX ?? 0;
    this.accelerationY = model.accelerationY ?? 0;
    this.movingAngle = model.movingAngle ?? 0;
  }

}