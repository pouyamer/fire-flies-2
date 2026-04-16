import { Ownable } from "../interfaces";
import { Firefly, FireflyServiceToggleKey } from "../models";
import { compareServiceToggles } from "../utilities";

export class OwnershipService {

  private readonly services = new Set<Ownable>();
  // private prevServiceToggleSnapshotMap 

  private previousFireflies: Firefly[];

  constructor(
    private readonly fireflies: Firefly[],
  ) {
    this.previousFireflies = [...fireflies]
  }

  register(service: Ownable) {
    this.services.add(service);
  }

  initOne(firefly: Firefly): void {
    for (const s of this.services) {
      if (firefly.serviceToggle.get(s.key as FireflyServiceToggleKey)) {
        s.add(firefly)
      }
    }
  }

  init(): void {
    for (const ff of this.fireflies) {
      this.initOne(ff);
    }
  }

  update(): void {
    for (const ff of this.fireflies) {
      const prevFirefly = this.previousFireflies.find(f => f === ff);

      if (!prevFirefly) {
        this.initOne(ff)

        return
      }

      const comparison = compareServiceToggles(prevFirefly.serviceToggle, ff.serviceToggle);

      ([...this.services])
        .filter(s => comparison.activated.includes(s.key) || comparison.halted.includes(s.key))
        .forEach(
          service => {
            if (comparison.activated.includes(service.key)) {
              service.add(ff)
              return;
            }

            if (comparison.halted.includes(service.key)) {
              service.remove(ff)
              return
            }
          }
        )
    }

    this.previousFireflies = [...this.fireflies];
  }



}