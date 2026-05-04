import { Mutator, Ownable } from "../interfaces";
import { Boundary, Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { BoundaryControlConfig, BoundaryRuleParameters, FireflyAppApiGetter } from "../types";

// const directions: Direction[] = ["bottom", "left", "right", "top"];
export class BoundaryControlService implements Mutator, Ownable {

  private fireflies: Firefly[] = [];

  key: FireflyServiceToggleKeyRequiringFirefly = 'bounds';


  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: BoundaryControlConfig,
  ) {
  }

  add(firefly: Firefly): void {
    if (!this.has(firefly)) {
      this.fireflies.push(firefly);
    }
  }

  remove(firefly: Firefly): void {
    if (this.has(firefly)) {
      this.fireflies.filter(ff => ff !== firefly)
    }
  }

  has(firefly: Firefly): boolean {
    return this.fireflies.includes(firefly)
  }


  public setOne(firefly: Firefly): void {
  }

  public set() {
    for (const ff of this.fireflies) {
      this.setOne(ff)
    }

    const boundaries = this.appApi('boundaries');

    this.config.boundaries.forEach(boundaryConfig => {
      boundaries.push(new Boundary({
        key: boundaryConfig.key,
        excludedFireflies: [],
        outRule: boundaryConfig.rules.out,
        touchedRule: boundaryConfig.rules.touched,
        onOut: boundaryConfig.onOut,
        onTouched: boundaryConfig.onTouched,
        touchedPositionCorrector: boundaryConfig.touchedPositionCorrector
      }))
    });
  }

  public updateOne(firefly: Firefly): void {


    const halfSize = firefly.size.value / 2;

    const parameters: BoundaryRuleParameters = {
      canvasHeight: this.appApi('canvas').height,
      canvasWidth: this.appApi('canvas').width,
      xMinusHalfSize: firefly.x - halfSize,
      xPlusHalfSize: firefly.x + halfSize,
      yMinusHalfSize: firefly.y - halfSize,
      yPlusHalfSize: firefly.y + halfSize,
      size: firefly.size.value
    }

    this.appApi('boundaries').forEach(
      boundary => {

        if (
          typeof boundary.outRule !== 'boolean' &&
          boundary.outRule(parameters)
        ) {
          boundary.onOut?.({
            firefly,
            api: this.appApi,
          })
        }

        if (
          typeof boundary.touchedRule !== 'boolean' &&
          boundary.touchedRule(parameters)
        ) {
          
          boundary.touchedPositionCorrector?.({
            firefly,
            api: this.appApi,
          })
          
          boundary.onTouched?.({
            firefly,
            api: this.appApi,
          })
        }
      }
    );
  }

  public update() {
    for (let ff of this.fireflies) {
      this.updateOne(ff);
    }
  }


}