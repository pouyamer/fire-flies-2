import { Utilities } from "../utilities";
import { Firefly } from "./firefly.model";

type CartersianCoordinates = {
  x: number;
  y: number
}

type CartesianTranslator = (coords: CartersianCoordinates) => CartersianCoordinates;

function isFirefly(
  value: CartersianCoordinates | Firefly,
): value is Firefly {
  return "key" in value;
}

const DEFAULT_COORDINATES = {
  x: 0,
  y: 0,
}

export class InteractiveLine  {
  start: CartersianCoordinates | Firefly;
  end: CartersianCoordinates | Firefly;
  startTranslator: CartesianTranslator | null;
  endTranslator: CartesianTranslator | null;
  color: string;
  lineWidth: number;

  constructor(model: Partial<InteractiveLine> = {}) {
    this.start = model.start ?? DEFAULT_COORDINATES;
    this.end = model.end ?? DEFAULT_COORDINATES;
    this.startTranslator = model.startTranslator ?? null;
    this.endTranslator = model.endTranslator ?? null;
    this.color = model.color ?? 'white';
    this.lineWidth = model.lineWidth ?? 1;

  }
  
  public getTranslatedStart(): CartersianCoordinates {
    return this.startTranslator
      ? this.startTranslator(this.start)
      : (() => this.start)();
  }

  public getTranslatedEnd(): CartersianCoordinates {
    return this.endTranslator
      ? this.endTranslator(this.end)
      : (() => this.end)();
  }
}