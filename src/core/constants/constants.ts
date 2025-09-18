import { FireflyCanvas } from "../models";
import { EventCallBack, FireflyNeighbourhoodPicker, LocationConfig, ValueGenerator } from "../types";
import { Utilities } from "../utilities";

export class CONSTANTS {

  public static CANVAS_EDGE_BOUNDS = {
    bottom: (canvas: FireflyCanvas) => canvas.height,
    top: (canvas: FireflyCanvas) => 0,
    left: (canvas: FireflyCanvas) => 0,
    right: (canvas: FireflyCanvas) => canvas.width
  }

  public static randomXCanvasWidth = this.createRandomValueBasedOnCanvasWidth();

  public static randomYCanvasHeight = this.createRandomValueBasedOnCanvasHeight();

  public static randomCanvasLocation = {
    x: this.randomXCanvasWidth,
    y: this.randomYCanvasHeight,
  }

  public static centerOfCanvas: LocationConfig = {
    x: ({canvas}) => canvas.width / 2,
    y: ({canvas}) => canvas.height / 2,
  }

  public static randomCanvasLocationWithSegments(
    xSegment?: number,
    ySegment?: number): {
    x: ValueGenerator<number | number[]>, 
    y: ValueGenerator<number | number[]>
  } {
    return {
      x: this.createRandomValueBasedOnCanvasWidth(xSegment),
      y: this.createRandomValueBasedOnCanvasHeight(ySegment),
    }
  }

  public static createRandomValueBasedOnCanvasWidth(segment?: number): ValueGenerator<number | number[]> {
    return ({canvas}) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((s, i) => i* canvas.width / Math.floor(segment))
        : []
      : Math.random() * canvas.width;
  }

  public static createRandomValueBasedOnCanvasHeight(segment?: number): ValueGenerator<number | number[]> {
    return ({canvas}) => (segment)
      ? segment >= 0
        ? Array(Math.floor(segment)).fill(null).map((s, i) => i* canvas.height / Math.floor(segment))
        : []
      : Math.random() * canvas.height;
  }

  public static NEIGHBOUR_PICKERS = {
    All: (): FireflyNeighbourhoodPicker => (ff, ffs) => ffs,
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
          const distance = Utilities.calculateDistance(f.x, f.y, ff.x, ff.y)
          return distance <= maxR && distance >= minR
        })
      }
    }
  }

  public static EVENT_CALLBACKS = {
    BlackHole: (strength: number, safeDistance: number): EventCallBack => {
      return ({currentFirefly: ff, canvas}) => {
        if (ff.neighboredBy) {
          const distanceToCandidate = Utilities.calculateDistance(
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
    BlackHoleWithExponentialFalloff: (strength: number): EventCallBack => {
      return ({currentFirefly: ff, canvas}) => {
        if (ff.neighboredBy) {
          const distanceToCandidate = Utilities.calculateDistance(
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

  
  public static Angles = {
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    THREE_HALF_PI: Math.PI / 2,
    Q_PI: Math.PI / 4,
    THREE_Q_PI: Math.PI / 4,
    nPi: (n: number) => n * Math.PI
  } as const;

  public static Ranges = {
    ALL_ANGLES: {
      min: 0,
      max: 2 * Math.PI
    }
  }

}