import { FireflyCanvas, FireflyServiceToggleKey } from "../models";
import { BoundaryConfig, BoundaryControlConfig, ChangingValueConfig, EventCallBack, EventCallBackWithFirefly, FireflyNeighbourhoodPicker, LocationConfig, ValueGeneratorWithFirefly } from "../types";
import { calculateDistance } from "../utilities";

export class CONSTANTS {

  public static randomXCanvasWidth = this.createRandomValueBasedOnCanvasWidth();

  public static randomYCanvasHeight = this.createRandomValueBasedOnCanvasHeight();

  public static randomCanvasLocation = {
    x: this.randomXCanvasWidth,
    y: this.randomYCanvasHeight,
  }

  public static centerOfCanvas: LocationConfig = {
    x: ({ api }) => api('canvas').width / 2,
    y: ({ api }) => api('canvas').height / 2,
  }

  public static randomCanvasLocationWithSegments(
    xSegment?: number,
    ySegment?: number): {
      x: ValueGeneratorWithFirefly<number | number[]>,
      y: ValueGeneratorWithFirefly<number | number[]>
    } {
    return {
      x: this.createRandomValueBasedOnCanvasWidth(xSegment),
      y: this.createRandomValueBasedOnCanvasHeight(ySegment),
    }
  }

  public static createRandomValueBasedOnCanvasWidth(segment?: number): ValueGeneratorWithFirefly<number | number[]> {
    return ({ api }) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((_, i) => i * api('canvas').width / Math.floor(segment))
        : []
      : Math.random() * api('canvas').width;
  }

  public static createRandomValueBasedOnCanvasHeight(segment?: number): ValueGeneratorWithFirefly<number | number[]> {
    return ({ api }) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((_, i) => i * api('canvas').height / Math.floor(segment))
        : []
      : Math.random() * api('canvas').height;
  }

  public static NEIGHBOUR_PICKERS = {
    All: (): FireflyNeighbourhoodPicker => (_, ffs) => ffs,
    Circle: (r: number): FireflyNeighbourhoodPicker => {
      return this.NEIGHBOUR_PICKERS.Ring(0, r)
    },
    Rectangle: (width: number, height: number): FireflyNeighbourhoodPicker => {
      return (ff, ffs) => {
        return ffs.filter(f => (
          Math.abs(f.x - ff.x) < width &&
          Math.abs(f.y - ff.y) < height
        ))
      }
    },
    Square: (width: number): FireflyNeighbourhoodPicker => {
      return this.NEIGHBOUR_PICKERS.Rectangle(width, width)
    },
    Ring: (minR: number, maxR: number): FireflyNeighbourhoodPicker => {
      return (ff, ffs) => {
        return ffs.filter(f => {
          const distance = calculateDistance(f.x, f.y, ff.x, ff.y)
          return distance <= maxR && distance >= minR
        })
      }
    }
  }

  public static EVENT_CALLBACKS = {
    BlackHole: (strength: number, safeDistance: number): EventCallBackWithFirefly => {
      return ({ firefly: ff, api }) => {
        const canvas = api('canvas');

        if (ff.neighboredBy) {
          const distanceToCandidate = calculateDistance(
            ff.x, ff.y, ff.neighboredBy.x, ff.neighboredBy.y
          );

          // Don't move if already very close
          if (distanceToCandidate < safeDistance) return;

          const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
          const normalizedDistance = distanceToCandidate / maxDistance;

          // Strong pull for medium distances, weak for very far distances
          const _strength = strength / (1 + normalizedDistance * 15);

          const dx = ff.neighboredBy.x - ff.x;
          const dy = ff.neighboredBy.y - ff.y;
          const magnitude = Math.sqrt(dx * dx + dy * dy);

          if (magnitude > 0) {
            ff.x += (dx / magnitude) * _strength;
            ff.y += (dy / magnitude) * _strength;
          }
        }
      }
    },
    BlackHoleWithExponentialFalloff: (strength: number): EventCallBackWithFirefly => {
      return ({ firefly: ff, api }) => {
        const canvas = api('canvas');

        if (ff.neighboredBy) {
          const distanceToCandidate = calculateDistance(
            ff.x, ff.y, ff.neighboredBy.x, ff.neighboredBy.y
          );

          // Exponential falloff - very strong up close, very weak far away
          const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
          const normalizedDistance = distanceToCandidate / maxDistance;
          const _strength = strength * Math.exp(-normalizedDistance * 5);

          const dx = ff.neighboredBy.x - ff.x;
          const dy = ff.neighboredBy.y - ff.y;
          const magnitude = Math.sqrt(dx * dx + dy * dy);

          if (magnitude > 0) {
            ff.x += (dx / magnitude) * _strength;
            ff.y += (dy / magnitude) * _strength;
          }
        }
      }
    }
  }

}

export const RANGES = {
  allAround: {
    min: 0,
    max: 2 * Math.PI
  }
}


export const CHANGING_VALUES_NEXT_VALUE_FNS = {
  incrementByValue: (value: number): ChangingValueConfig['nextValueFn'] => {
    return ({ current }) => (current + value);
  },
  decrementByValue: (value: number): ChangingValueConfig['nextValueFn'] => {
    return ({ current }) => (current - value);
  },
}


export const DEFAULT_COORDINATES = {
  x: 0,
  y: 0,
}

const TOP_BOUNDARY_CONFIG_RULES: BoundaryConfig['rules'] = {
  out: ({
    yPlusHalfSize,
  }) => yPlusHalfSize <= 0,
  touched: ({ yMinusHalfSize }) => yMinusHalfSize <= 0,
}

const LEFT_BOUNDARY_CONFIG_RULES: BoundaryConfig['rules'] = {
  out: ({
    xPlusHalfSize,
  }) => xPlusHalfSize <= 0,
  touched: ({ xMinusHalfSize }) => xMinusHalfSize <= 0,
}

const BOTTOM_BOUNDARY_CONFIG_RULES: BoundaryConfig['rules'] = {
  out: ({
    yMinusHalfSize,
    canvasHeight
  }) => yMinusHalfSize >= canvasHeight,
  touched: ({ yPlusHalfSize, canvasHeight }) => yPlusHalfSize >= canvasHeight,
}

const RIGHT_BOUNDARY_CONFIG_RULES: BoundaryConfig['rules'] = {
  out: ({
    xMinusHalfSize,
    canvasWidth
  }) => xMinusHalfSize >= canvasWidth,
  touched: ({ xPlusHalfSize, canvasWidth }) => xPlusHalfSize >= canvasWidth,
}

export const DIRECTIONAL_BOUNDARY_CONFIGS: Record<
  | 'topWithPC'
  | 'topWithoutPC'
  | 'bottomWithPC'
  | 'bottomWithoutPC'
  | 'leftWithPC'
  | 'leftWithoutPC'
  | 'rightWithPC'
  | 'rightWithoutPC'
  , BoundaryConfig> = {
    topWithPC: {
      key: 'top',
      rules: TOP_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.y = firefly.size.value / 2
      }
    },
    topWithoutPC: {
      key: 'top',
      rules: TOP_BOUNDARY_CONFIG_RULES,
    },
    bottomWithPC: {
      key: 'bottom',
      rules: BOTTOM_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.y = api('canvas').height - firefly.size.value / 2
      }
    },
    bottomWithoutPC: {
      key: 'bottom',
      rules: BOTTOM_BOUNDARY_CONFIG_RULES,
    },
    leftWithPC: {
      key: 'left',
      rules: LEFT_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly }) => {
        firefly.x = firefly.size.value / 2
      }
    },
    leftWithoutPC: {
      key: 'left',
      rules: LEFT_BOUNDARY_CONFIG_RULES,
    },
        rightWithPC: {
      key: 'right',
      rules: RIGHT_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.x = api('canvas').width - firefly.size.value / 2
      }
    },
    rightWithoutPC: {
      key: 'right',
      rules: RIGHT_BOUNDARY_CONFIG_RULES,
    },
  } as const;

export const ALL_SERVICE_KEYS: FireflyServiceToggleKey[] = [
  "bounds",
  "collision",
  "draw",
  "globalFireflyModifier",
  "life",
  "location",
  "neighbourhood",
  "red",
  "green",
  "blue",
  "alpha",
  "hue",
  "saturation",
  "lightness",
  "shape",
  "window",
  "jitterX",
  "jitterY",
  "jitterPolarAngle",
  "jitterPolarAmount",
  "size",
  "speedX",
  "speedY",
  "polarSpeedAngle",
  "polarSpeedAmount",
  "rotation",
  "trailing"
]