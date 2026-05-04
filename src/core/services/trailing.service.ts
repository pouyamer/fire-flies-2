import { Mutator, Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKeyRequiringFirefly } from "../models";
import { FireflyTrail } from "../models/firefly-trail.model";
import { FireflyAppApiGetter } from "../types";

export class FireflyTrailingService 
  implements Ownable, Mutator {
    key: FireflyServiceToggleKeyRequiringFirefly = "trailing";

    private fireflies: Firefly[] = [];

    
    constructor(
      private readonly appApi: FireflyAppApiGetter,
    ) {}

    add(firefly: Firefly): void {
      if(!this.has(firefly)) {
        this.fireflies.push(firefly);
      }
    }

    remove(firefly: Firefly): void {
      if(this.has(firefly)) {
        this.fireflies.filter(ff => ff !== firefly)
      }
    }

    has(firefly: Firefly): boolean {
      return this.fireflies.includes(firefly)
    }

    setOne(firefly: Firefly): void {
      
    }

    set(): void {
      
    }

    updateOne(firefly: Firefly): void {
      firefly.trails.push(new FireflyTrail(firefly))

      if (firefly.trails.length > firefly.size.value) {
        firefly.trails.shift();
      }

      firefly.trails.forEach((ft, i) => {
        ft.size = i
      })
    }

    update(): void {
      this.fireflies.forEach(ff => {
        this.updateOne(ff)
      })
    }
  }