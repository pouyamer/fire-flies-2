import { Mutator } from "../interfaces";
import { Firefly } from "../models";
import { FireflyAppApiGetter, NeighbourhoodConfig } from "../types";


export class NeighbourhoodService
  implements Mutator {

  private fireflies: Firefly[] = [];
    
  protected candidateFireflies: Firefly[] = [];
    

  constructor(
    private readonly appApi: FireflyAppApiGetter,
    private readonly config: NeighbourhoodConfig,
  ) {
  }

  public markFireflyAsCandidate(firefly: Firefly): void {
    if (!this.fireflies.map(ff => ff.key).includes(firefly.key)) {
      this.candidateFireflies.push(firefly)
    }
  }

  addFirefly(firefly: Firefly): void {
    this.fireflies.push(firefly)
  }

  setOne(/* firefly: Firefly */): void {
    
  }

  set(): void {
    this.candidateFireflies = this.config.candidatePicker({api: this.appApi})
  }

  updateOne(/* firefly: Firefly */): void {
  }
  
  update(): void {


    // handle candidates
    if (this.config.candidatePickingStrategy === 'reactive') {
      this.candidateFireflies = this.config.candidatePicker({api: this.appApi})
    }
      const oldCondidates = this.candidateFireflies;

      // candidates that are no longer candidates
      const pastCandidates = oldCondidates.filter(c => !this.candidateFireflies.includes(c))

      this.fireflies.filter(ff =>  ff.neighboredBy &&  pastCandidates.includes(ff.neighboredBy)).forEach(
        ff => {
          ff.neighboredBy = null;
          this.config.onNeighbourhoodExit?.({
            firefly: ff,
            api: this.appApi,
          })
        }
      )

      // Events:
      this.candidateFireflies.forEach(
        c => this.config.onCandidatePicked?.({
          firefly: c,
            api: this.appApi,
        })
      )

      pastCandidates.forEach(
        pc => this.config.onCandidateDismissed?.({
          firefly: pc,
            api: this.appApi,
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
          firefly: nnf,
            api: this.appApi,
        })
      })
      
      newNeighbours.forEach(nf => {
        this.config.onNeighbourhoodEnter?.({
          firefly: nf,
            api: this.appApi,
        });
      })
      
      neighbours.forEach(nff => {
        this.config.onNeighbourhood?.({
          firefly: nff,
            api: this.appApi,
        })
      })

      pastNeighbours.forEach(pf => {
        this.config.onNeighbourhoodExit?.({
          firefly: pf,
            api: this.appApi,
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