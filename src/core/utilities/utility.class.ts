import { ALL_SERVICE_KEYS } from "../constants";
import { Mutator, MutatorGroup, Ownable } from "../interfaces";
import { ChangingNumericalValueItem, Firefly, FireflyServiceToggle, FireflyServiceToggleKeyRequiringFirefly, HslColor, Range, RgbColor } from "../models";
import { CartersianCoordinates, PossibleValue, SpeedConfig, ValueGeneratorWithFirefly, ValueGeneratorWithFireflyParameters, WeightedValue } from "../types";

export function drawLineByCartesianCoordinates(
  ctx: CanvasRenderingContext2D,
  start: CartersianCoordinates,
  end: CartersianCoordinates,
  extensionFromStart: number,
  extensionFromEnd: number,
  color: string,
  lineWidth: number,
): void {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;

  const extendedStartX = start.x - ux * extensionFromStart;
  const extendedStartY = start.y - uy * extensionFromStart;

  const extendedEndX = end.x + ux * extensionFromEnd;
  const extendedEndY = end.y + uy * extensionFromEnd;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(extendedStartX, extendedStartY);
  ctx.lineTo(extendedEndX, extendedEndY);
  ctx.stroke();
}


export function isRange(target: unknown): target is Range {
  return (
    target !== null &&
    typeof target === "object" &&
    "min" in target &&
    "max" in target
  )
}

export function calculateDistance(firefly1: Firefly, firefly2: Firefly): number
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number
export function calculateDistance(x1: number | Firefly, y1: number | Firefly, x2?: number, y2?: number): number {

  const coordinatesParameters: {
    _x1: number;
    _y1: number;
    _x2: number;
    _y2: number
  } = {
    _x1: typeof x1 === 'number' ? x1 : x1.x,
    _y1: typeof y1 === 'number' ? y1 : typeof x1 === 'number' ? NaN : x1.x,
    _x2: (x2 !== undefined) ? x2 : typeof y1 === 'number' ? NaN : y1.x,
    _y2: (y2 !== undefined) ? y2 : typeof y1 === 'number' ? NaN : y1.y
  };

  const { _x1, _y1, _x2, _y2 } = coordinatesParameters;

  return Math.sqrt((_x1 - _x2) ** 2 + (_y1 - _y2) ** 2);
}

export function isRangeArray(target: unknown): target is Range[] {
  return (
    target !== null &&
    Array.isArray(target) &&
    target.every(v => isRange(v))
  )
}

export function isWeightedValues<T>(target: unknown): target is WeightedValue<T>[] {
  return Array.isArray(target) && target.every(t => isWeightedValue<T>(t))
}

export function isWeightedValue<T>(target: unknown): target is WeightedValue<T> {
  return (
    target !== null &&
    typeof target === "object" &&
    "value" in target &&
    "weight" in target
  )
}

export function range(min: number, max: number): Range
export function range(mirroredValue: number): Range // -number, +number
export function range(minMax: [number, number]): Range
export function range(first: number | [number, number], second?: number): Range {

  const min = Array.isArray(first)
    ? first[0]
    : second !== undefined
      ? first
      : -Math.abs(first)

  const max = Array.isArray(first)
    ? first[1]
    : second !== undefined
      ? second
      : Math.abs(first)

  return { min, max }
}

export function randomBetween(
  range: Range,
  getAsInteger?: boolean
): number {
  const { min, max } = range
  return getAsInteger
    ? Math.floor(Math.random() * (max - min + 1)) + min
    : Math.random() * (max - min) + min
}

export function getSign(input: number): number {
  if (input < 0) return -1
  if (input > 0) return 1
  return 0
}


export function isNumberArray(target: unknown): target is number[] {
  return (
    target !== null &&
    Array.isArray(target) &&
    target.every(v => typeof v === "number")
  );
}

export function isObject(item: object): boolean {
  return item && typeof item === "object" && !Array.isArray(item)
}

export function deepMerge(target: any, source: any) {
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = deepMerge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export function cartesianToPolar(
  x: number,
  y: number
) {
  const polarSpeedAmount = Math.sqrt(x * x + y * y);
  const polarSpeedAngle = Math.atan2(y, x);

  return {
    polarSpeedAngle,
    polarSpeedAmount
  };
}

export function polarToCartesian(
  polarAmount: number,
  polarAngle: number,
) {
  const x = polarAmount * Math.cos(polarAngle);
  const y = polarAmount * Math.sin(polarAngle);

  return { x, y };
}


export function getNonNumericValue<T>(
  rawValue: T | T[]
): T;
export function getNonNumericValue<T>(
  rawValue: ValueGeneratorWithFirefly<T>,
  valueGeneratorArgs: ValueGeneratorWithFireflyParameters
): T
export function getNonNumericValue<T>(
  rawValue: PossibleValue<T>,
  valueGeneratorArgs?: ValueGeneratorWithFireflyParameters
): T {
  if (Array.isArray(rawValue)) {
    return chooseBetweenMultipleValues(rawValue);
  }
  else if (typeof rawValue === "function") {
    return rawValue(valueGeneratorArgs as ValueGeneratorWithFireflyParameters);
  }
  else {
    return rawValue as T;
  }
}

export function getNumericValue(
  rawValue: number | Range | number[] | Range[] | WeightedValue<number>[],
): number
export function getNumericValue(
  rawValue: Range,
  getAsInteger: boolean,
): number
export function getNumericValue(
  rawValue: ValueGeneratorWithFirefly<number>,
  valueGeneratorArgs: ValueGeneratorWithFireflyParameters
): number;
export function getNumericValue(
  rawValue: PossibleValue<number>,
  secondArgument?: boolean | ValueGeneratorWithFireflyParameters
): number {
  if (typeof rawValue === "number") {
    return rawValue;
  }
  else if (isRange(rawValue)) {
    // Range
    return secondArgument && typeof secondArgument === "boolean"
      ? randomBetween(rawValue, secondArgument)
      : randomBetween(rawValue)
  }
  else if (Array.isArray(rawValue)) {
    // if it is Range then it should be handled by Range mode
    const chosenValue: Range | number = rawValue.every(v => typeof v === "number" || isRange(v))
      ? chooseBetweenMultipleValues<Range | number>(rawValue)
      : getValueFromWeightedValues(rawValue);

    return typeof chosenValue === "number"
      ? chosenValue
      : getNumericValue(chosenValue)

  }
  else if (!isRange(rawValue) && secondArgument && typeof secondArgument !== "boolean") {
    const valueFromGenerator = rawValue(
      secondArgument
    );

    return typeof valueFromGenerator === "number" ? valueFromGenerator : getNumericValue(valueFromGenerator)
  }
  else {
    return 0;
  }
}


export function chooseBetweenMultipleValues<T>(values: T[]): T {
  const index = randomBetween({
    min: 0,
    max: values.length - 1
  }, true)

  return values[index]
}

export function getValueFromWeightedValues<T>(values: WeightedValue<T>[]): T {
  if (values.length === 0) {
    throw new Error('Cannot select from empty array');
  }

  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than 0');
  }

  const random = Math.random() * totalWeight;

  let accumulatedWeight = 0;

  for (const item of values) {
    accumulatedWeight += item.weight;
    if (random <= accumulatedWeight) {
      return item.value;
    }
  }

  return values[values.length - 1].value;
}

export function createWeightedValue<T>(...params: [value: T, weight: number][]): WeightedValue<T>[] {
  return params.map(([value, weight]) => ({ value, weight }));
}

function isRgbColor(value: unknown): value is RgbColor {
  return (
    value !== null &&
    typeof value === 'object' &&
    'red' in value &&
    'green' in value &&
    'blue' in value &&
    'alpha' in value
  );
}

function isHslColor(value: unknown): value is HslColor {
  return (
    value !== null &&
    typeof value === 'object' &&
    'hue' in value &&
    'saturation' in value &&
    'lightness' in value &&
    'alpha' in value
  );
}

export const ColorUtil = {
  isRgbColor,
  isHslColor,
}

export const SPEED_CONFIGS = {
  onlyCartesianValue: (
    speedX: number,
    speedY: number
  ): SpeedConfig => ({
    polarSpeedAmount: {
      value: 0
    },
    polarSpeedAngle: {
      value: 0
    },
    speedX: {
      value: speedX,
    },
    speedY: {
      value: speedY
    }
  }),
  onlyPolarValue: (
    polarSpeedAngle: number,
    polarSpeedAmount: number
  ): SpeedConfig => ({
    polarSpeedAmount: {
      value: polarSpeedAmount
    },
    polarSpeedAngle: {
      value: polarSpeedAngle
    },
    speedX: {
      value: 0,
    },
    speedY: {
      value: 0
    }
  })
} as const;

export function drawArcByCartesianCoordinates(
  ctx: CanvasRenderingContext2D,
  start: CartersianCoordinates,
  end: CartersianCoordinates,
  perpendicularOffset: number,
  counterClockWise: boolean,
  color: string,
  lineWidth: number,
): void {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Direction vector from start → end
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Perpendicular unit vector (normalized)
  const length = Math.hypot(dx, dy);
  const perpX = -dy / length;
  const perpY = dx / length;

  // Compute circle center: midpoint + offset along perpendicular
  const cX = midX + perpX * perpendicularOffset;
  const cY = midY + perpY * perpendicularOffset;

  // Calculate radius as distance from center to start (or end)
  const radius = Math.hypot(start.x - cX, start.y - cY);

  // Get start and end angles relative to circle center
  const startAngle = Math.atan2(start.y - cY, start.x - cX);
  const endAngle = Math.atan2(end.y - cY, end.x - cX);

  ctx.beginPath();
  ctx.arc(cX, cY, radius, startAngle, endAngle, counterClockWise);
  ctx.stroke();
}


export function isFirefly(
  value: Firefly | CartersianCoordinates | (() => CartersianCoordinates),
): value is Firefly {
  return typeof value === 'object' && !Array.isArray(value) && ("key" in value);
}

export function isOwnable(value: Mutator | MutatorGroup | Ownable): value is Ownable {
  return (
    "add" in value && typeof value.add === 'function' &&
    "remove" in value && typeof value.remove === 'function' &&
    "has" in value && typeof value.has === 'function' 
  )

}

export function compareServiceToggles(prev: FireflyServiceToggle, next: FireflyServiceToggle): {
  activated: FireflyServiceToggleKeyRequiringFirefly[],
  halted: FireflyServiceToggleKeyRequiringFirefly[],
} {
  
  // false => true
  const activated: FireflyServiceToggleKeyRequiringFirefly[] = [];
  const halted: FireflyServiceToggleKeyRequiringFirefly[] = [];
  
  ALL_SERVICE_KEYS.forEach(
    sKey => {
      const first = prev.get(sKey);
      const second = next.get(sKey);

      if (!first && second) {
        activated.push(sKey);
        return
      }

      if (first && !second) {
        halted.push(sKey);
        return
      }
    }
  )

  return {
    activated,
    halted,
  }
}

  export function getTrailOrFireflyValue(v: number | ChangingNumericalValueItem) {
    return (v && typeof v === 'object' && 'value' in v) ? v.value : v;
  }