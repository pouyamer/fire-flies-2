import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { Firefly } from "../models";
import { ChangingValueConfig } from "../types";

export const alphaConfig: ChangingValueConfig = {
  name: ServiceName.Alpha,
  type: ChangeType.Decremental,
  decrement: {
    min: .001,
    max: .005
  },
  value: {
    min: .0,
    max: 1
  },
  minPossibleValue: 0,

  onMinReached: (ff, c, ffs, app) => {
    ff.speedX = ff.initialFireflySnapshot?.speedX ?? 0;
    ff.speedY = ff.initialFireflySnapshot?.speedY ?? 0;
    app.setServicesOnSingleFirefly(ff)
  }
  
}