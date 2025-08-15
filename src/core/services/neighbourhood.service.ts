import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { JitterConfig, NeighbourhoodConfig } from "../types";
import { Utilities } from "../utilities";

export class NeighbourhoodService
  implements Service {

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
    
  }

  onFramePassForSingleFirefly(firefly: Firefly): void {
    
  }
  
  onFramePass(): void {

    const distance = 100 //TEST

    const chosenFireflies = [
      this.fireflies[0],

    ]

    chosenFireflies.forEach(chosenFirefly => {

      // chosenFirefly.hue.value = 120;

      const nonNeighboredFireflies = this.fireflies.filter(
        ff => (ff.neighboredBy === null || ff.neighboredBy === chosenFirefly) && !chosenFireflies.includes(ff)
      ) //TEST

      this.fireflies.filter(ff=> ff.neighboredBy === chosenFirefly).forEach(
        (ff, i, neighbors) => {
          const distanceBetweenTwoFireflies = Utilities.calculateDistance(
            chosenFirefly?.x ?? 0,
            chosenFirefly?.y ?? 0,
            ff?.x ?? 0,
            ff?.y ?? 0,
          )

          if (distanceBetweenTwoFireflies > distance) {
            chosenFirefly!.neighbors = neighbors.filter(n => n !== ff) 
            ff.neighboredBy = null
            this.app.setServicesOnSingleFireflyByServiceNames(ff, ServiceName.Size, ServiceName.Hue, ServiceName.Speed)
            // onNeighborhoodExit
            // ff.hue.value = 3
            // ff.size.value = 0
          } 
        }
      )

      // previous nearby fireflies
      const previousNearByFireflies = chosenFirefly!.neighbors

  
      // idetifying nearbyFireflies
      const nearbyFireflies = nonNeighboredFireflies.filter(nnff => {
        const distanceBetweenTwoFireflies = Utilities.calculateDistance(
          chosenFirefly?.x ?? 0,
          chosenFirefly?.y ?? 0,
          nnff?.x ?? 0,
          nnff?.y ?? 0,
        )

        return distanceBetweenTwoFireflies <= distance && nnff !== chosenFirefly
      })

      // making neighborhood
      chosenFirefly!.neighbors = nearbyFireflies
      nearbyFireflies.forEach(
        nbff => {
          nbff.neighboredBy = chosenFirefly;
        }
      )

      const newFireFlies = nearbyFireflies.filter(
        ff => !previousNearByFireflies.includes(ff)
      )

      // onNeighborhoodEnter
      newFireFlies.forEach(
        ff => {
          // ff.speedX = -4* ff.speedX;
          // ff.speedY = -4* ff.speedY;
          // ff.size.value /= 2
          // ff.hue.value = 0
        }
      )

      
      //onInNeighborhood
      chosenFirefly!.neighbors.forEach(
        ff => {
        }
      )
  })

}

    
}