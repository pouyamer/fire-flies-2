import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Service } from "../interfaces";
import { Firefly, FireflyCanvas } from "../models";
import { CollisionConfig } from "../types";
import { Utilities } from "../utilities";

export class CollisionService 
  implements Service {

  public name = ServiceName.Collision;

  constructor(
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: CollisionConfig,
    private readonly app: FireflyApp,
    private readonly collisions: Firefly[][],
  ) {}

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    // if (this.collisions.length) {
    //   console.log(this.collisions)
  
    //   }
    // this.fireflies.forEach(
    //   (ff, i) => {
    //     if (
    //       Utilities.calculateDistance(firefly.x, firefly.y, ff.x, ff.y)  < (ff.size.value + firefly.size.value) && 
    //       ff !== firefly
    //     ) {

    //       if (this.collisions.length === 0) {
    //         this.collisions.push([firefly, ff])
    //       } else {
    //         this.collisions.forEach(col => {
    //           if (!col.includes(firefly)) {
    //             this.collisions.push([firefly, ff])
    //           }
    //           else {
    //             const collisionContainingCurrentFirefly = this.collisions.find(col => col.includes(firefly));
    //             if (!collisionContainingCurrentFirefly?.includes(ff)) {
    //               collisionContainingCurrentFirefly?.push(ff)
    //             }
    //           }
    //         })
    //       }

    //       for(let c of this.collisions) {
    //         if (!c.includes(firefly)) {
    //           this.collisions.push([firefly])
    //         }
    //       }
    //     }
    //     else {
          
    //     }
    //   }
    // )

    // // cleaning phase
    // this.collisions.filter(c => c.length === 1)



    // this.collisions.forEach(
    //   collide => {
    //     if(collide.length) {

    //       console.log("collided")
    //     }
    //   }
    // )

    
  }
  
  public setOnSingleFirefly(firefly: Firefly): void {
    
  }

  public onFramePass(): void {
    for(let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }

  public setOnEveryFirefly(): void {
    
  }
}