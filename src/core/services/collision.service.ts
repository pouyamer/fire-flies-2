import { Mutator } from "../interfaces";
import { Firefly } from "../models";

export class CollisionService 
  implements Mutator {

  constructor(
    // canvas: FireflyCanvas,
    // private readonly fireflies: Firefly[],
    // config: CollisionConfig,
    // app: FireflyApp,
    // collisions: Firefly[][],
  ) {}

  addFirefly(firefly: Firefly): void {
    
  }

  public setOne(/* firefly: Firefly */): void {
    // if (this.collisions.length) {
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

    //     }
    //   }
    // )

    
  }
  
  public set(/* firefly: Firefly */): void {
    
  }

  public updateOne(firefly: Firefly): void {
    // for(let ff of this.fireflies) {
    //   this.onFramePassForSingleFirefly()
    // }
  }

  public update(): void {
    
  }
}