import { ServiceName } from "../enums";
import { Color } from "../models";
import { ChangingValueConfig } from "../types";
import { Utilities } from "../utilities";

/**
 * @param alphaConfig - This config is a color variable config
 */
export const alphaConfig: ChangingValueConfig = {
  value: Utilities.range(0, 1),
  nextValueFn: ({currentFirefly}) => {
    return currentFirefly.alpha.value - .01
  },
  min: 0,
  onMin: ({currentFirefly, app}) => {
    currentFirefly.alpha.value = 1;
    app.setServicesOnSingleFireflyByServiceNames(currentFirefly, ServiceName.Location)
  }
}