import { FireflyApp } from "../app";
import { ServiceName, Shape } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { JitterConfig, NeighbourhoodConfig } from "../types";
import { Utilities } from "../utilities";


export class NeighbourhoodService
  implements Service {

  protected candidateFireflies: Firefly[] = [];
    
  public name = ServiceName.Neighbourhood;


  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: NeighbourhoodConfig,
    private readonly app: FireflyApp
  ) {}

  setOnSingleFirefly(firefly: Firefly): void {
    
  }

  setOnEveryFirefly(): void {
    this.candidateFireflies = this.config.candidatePicker({
      canvas: this.canvas,
      fireflies: this.fireflies,
      app: this.app
    })
  }

  onFramePassForSingleFirefly(firefly: Firefly): void {
    
  }
  
  onFramePass(): void {

    this.candidateFireflies.forEach(chosenFirefly => {

      chosenFirefly.alpha.value = 0;
      chosenFirefly.speedX = 0;
      chosenFirefly.speedY = 0;
      chosenFirefly.shape = Shape.Circle;

      const availableFireflies = this.fireflies.filter(ff => {
        return (
          !this.candidateFireflies.includes(ff) && // not from candidates
          ff !== chosenFirefly && // not self
          (ff.neighboredBy === null || ff.neighboredBy === chosenFirefly) // not picked
        );
      })

      const neighbours = this.config.neighbourPicker(chosenFirefly, availableFireflies)

      const newNeighbours = neighbours.filter(nf => nf.neighboredBy !== chosenFirefly);

      const pastNeighbours = this.fireflies.filter(ff => (
        ff.neighboredBy === chosenFirefly &&
        !neighbours.includes(ff)
      ));

      // events
      newNeighbours.forEach(nf => {
        // onNeighbourhoodEnter
        nf.alpha.value = 1;
        nf.speedX /=100;
        nf.speedY /=100;
      })
      
      neighbours.forEach(nff => {
        // onNeighbourhood
        nff.alpha.value = 1;
        nff.hue.value = 0;
      })

      pastNeighbours.forEach(pf => {
        // onNeighbourhoodExit
        pf.alpha.value = 1;
        pf.speedX *=100;
        pf.speedY *=100;

      })

      // mark neighbours and non neighbours
      neighbours.forEach(nf => {
        nf.neighboredBy = chosenFirefly
      })

      pastNeighbours.forEach(pf => {
        pf.neighboredBy = null;
      })
    })

  }
    
}