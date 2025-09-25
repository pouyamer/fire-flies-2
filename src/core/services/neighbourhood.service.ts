import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { NeighbourhoodConfig } from "../types";


export class NeighbourhoodService
  implements Service {

  private fireflies: Firefly[];
    
  protected candidateFireflies: Firefly[] = [];
    
  public name = ServiceName.Neighbourhood;


  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: NeighbourhoodConfig,
    private readonly app: FireflyApp
  ) {
    this.fireflies = [...fireflies];
  }

  public addFireflies(fireflies: Firefly[]): void {
    const fireflyKeys = this.fireflies.map(({key}) => key);

    for(const ff of fireflies) {
      if (!fireflyKeys.includes(ff.key)) fireflies.push(ff);
      this.setOnSingleFirefly(ff);
    }
  }

  public removeFireflies(fireflies: Firefly[]): void {
    const removingFireflyKeys = fireflies.map(({key}) => key);
    
    this.fireflies = this.fireflies.filter(({key}) => !removingFireflyKeys.includes(key));
  }

  public markFireflyAsCandidate(firefly: Firefly): void {
    if (!this.fireflies.map(ff => ff.key).includes(firefly.key)) {
      this.candidateFireflies.push(firefly)
    }
  }

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


    // handle candidates
    if (this.config.candidatePickingStrategy === 'reactive') {
      this.candidateFireflies = this.config.candidatePicker({
        canvas: this.canvas,
        fireflies: this.fireflies,
        app: this.app
      })
    }
      const oldCondidates = this.candidateFireflies;



      // candidates that are no longer candidates
      const pastCandidates = oldCondidates.filter(c => !this.candidateFireflies.includes(c))

      this.fireflies.filter(ff =>  ff.neighboredBy &&  pastCandidates.includes(ff.neighboredBy)).forEach(
        ff => {
          ff.neighboredBy = null;
          this.config.onNeighbourhoodExit?.({
            currentFirefly: ff,
            app: this.app,
            canvas: this.canvas,
            fireflies: this.fireflies,
          })
        }
      )

      // Events:
      this.candidateFireflies.forEach(
        c => this.config.onCandidatePicked?.({
          currentFirefly: c,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies
        })
      )

      pastCandidates.forEach(
        pc => this.config.onCandidateDismissed?.({
          currentFirefly: pc,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies,
        })
      )
    
    // handle neighbours
    this.candidateFireflies.forEach(chosenFirefly => {
      const availableFireflies = this.fireflies.filter(ff => {
        return (
          (this.config.canPickCandidates || !this.candidateFireflies.includes(ff)) && // not from candidates
          ff !== chosenFirefly && // not self
          (
            this.config.canPickNeighboursFromOtherCandidates || (
              ff.neighboredBy === null ||
              ff.neighboredBy === chosenFirefly
            )
          ) // not picked
        );
      })

      const neighbours = this.config.neighbourPicker(chosenFirefly, availableFireflies)

      const newNeighbours = neighbours.filter(nf => nf.neighboredBy !== chosenFirefly);

      const pastNeighbours = this.fireflies.filter(ff => (
        ff.neighboredBy === chosenFirefly &&
        !neighbours.includes(ff)
      ));

      const nonNeighbours = this.fireflies.filter(ff => (
        !neighbours.includes(ff)
      ))

      // events
      nonNeighbours.forEach(nnf => {
        this.config.onNotInNeighbourhood?.({
          currentFirefly: nnf,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies,
        })
      })
      
      newNeighbours.forEach(nf => {
        this.config.onNeighbourhoodEnter?.({
          currentFirefly: nf,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies,
        });
      })
      
      neighbours.forEach(nff => {
        this.config.onNeighbourhood?.({
          currentFirefly: nff,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies,
        })
      })

      pastNeighbours.forEach(pf => {
        this.config.onNeighbourhoodExit?.({
          currentFirefly: pf,
          app: this.app,
          canvas: this.canvas,
          fireflies: this.fireflies,
        })
      })

      // mark neighbours and non neighbours
      neighbours.forEach(nf => {
        nf.neighboredBy = chosenFirefly;
      })

      pastNeighbours.forEach(pf => {
        pf.neighboredBy = null;
      })
    })

  }
    
}