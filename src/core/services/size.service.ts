import { Service } from "../interfaces";
import { Firefly } from "../models";

export class SizeService
  implements Service {

  fireflies: Firefly[];

  constructor(fireflies: Firefly[]) {
    this.fireflies = fireflies;
  }

  public execute(): void {
    this.fireflies.forEach(
      firefly => {
      }
    )
  }
}