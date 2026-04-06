import { Shape } from "../enums";
import { ShapeValue } from "../types";
import { ChangingNumericalValueItem } from "./changing-numerical-value-item.model";
import { FireflyServiceToggle } from "./firefly-service-toggle.model";

export class Firefly {
  key: string | null;
  hue: ChangingNumericalValueItem;
  size: ChangingNumericalValueItem;
  saturation: ChangingNumericalValueItem;
  lightness: ChangingNumericalValueItem;
  red: ChangingNumericalValueItem;
  green: ChangingNumericalValueItem;
  blue: ChangingNumericalValueItem;
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
  initialFireflySnapshot: unknown | null;
  rotation: ChangingNumericalValueItem;
  firefliesInCollision: Firefly[];
  drawMethod: 'fill' | 'stroke';
  life: number;
  neighboredBy: Firefly | null;
  neighbors: Firefly[];
  beforeEnteringNeighborhoodSnapshot: Firefly | null;
  strokeLineWidth: number;
  serviceToggle = new FireflyServiceToggle();
  // Read & Write to an object that you can use its value later
  private _info: Record<string, any> = {}
  // Assign a tag that can be later used for filtering or doing certain operations
  private _tags: string[] = [];

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
      _tags: []
    }
    this.speedX = model.speedX ?? new ChangingNumericalValueItem();
    this.speedY = model.speedY ?? new ChangingNumericalValueItem();
    this.polarSpeedAngle = model.polarSpeedAngle ?? new ChangingNumericalValueItem();
    this.polarSpeedAmount = model.polarSpeedAmount ?? new ChangingNumericalValueItem();
    this.rotation = model.rotation ?? new ChangingNumericalValueItem();
    this.jitterX = model.jitterX ?? new ChangingNumericalValueItem();
    this.jitterY = model.jitterY ?? new ChangingNumericalValueItem();
    this.jitterPolarAmount = model.jitterPolarAmount ?? new ChangingNumericalValueItem();
    this.jitterPolarAngle = model.jitterPolarAngle ?? new ChangingNumericalValueItem();
    this.red = model.red ?? new ChangingNumericalValueItem();
    this.green = model.green ?? new ChangingNumericalValueItem();
    this.blue = model.blue ?? new ChangingNumericalValueItem();
    this.firefliesInCollision = model.firefliesInCollision ?? [];
    this.neighboredBy = model.neighboredBy ?? null;
    this.neighbors = model.neighbors ?? [];
    this.beforeEnteringNeighborhoodSnapshot = null;
    this.drawMethod = model.drawMethod ?? 'fill';
    this.life = model.life ?? Infinity;
    this.strokeLineWidth = model.strokeLineWidth ?? 1;
  }

  public get info() {
    return this._info;
  }

  public addTag(tag: string): void {
    if (!this._tags.length) {
      this._tags = [tag];
      return;
    }

    if (this._tags.includes(tag)) return;

    this._tags.push(tag);
  }

  public addTags(...tags: string[]): void {
    for (const tag of tags) {
      this.addTag(tag)
    }
  }

  public removeTag(tag: string) {
    if (
      !this._tags.length ||
      !this._tags.includes(tag)
    ) return;

    this._tags = this._tags.filter(t => t !== tag);
  }

  public removeTags(...tags: string[]): void {
    for (const tag in tags) {
      this.removeTag(tag);
    }
  }

  public hasTag(tag: string): boolean {
    return this._tags.includes(tag);
  }

  public hasTags(...tags: string[]): boolean {
    return tags.reduce((acc, tag) => acc && this.hasTag(tag), true)
  }

  public writeInfo(...keyValuePairs: [string, any][]): Record<string, any> {

    keyValuePairs.forEach(([key, value]) => {
      if (key in this._info) {
        this._info[key] = value;
      }

      this._info = {
        ...this._info,
        [key]: value,
      };
    })

    return this._info;
  }

  public getInfoByKey(key: string): any {
    return this._info?.[key];
  }
}