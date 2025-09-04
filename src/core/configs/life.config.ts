import { v4 } from "uuid";
import { LifeConfig } from "../types";
import { Firefly } from "../models";
import { ServiceName } from "../enums";
import { Utilities } from "../utilities";

export const lifeConfig: LifeConfig = {
  value: ({fireflies}) => 1000,
  codeGenerator: () => v4(),
  nextValueFn: ({currentFirefly, fireflies}) => {return currentFirefly.life - currentFirefly.hue.value / 50 - 1},
  onFireflyDead: ({fireflies, app, currentFirefly}) => {
    // const offSprings = Utilities.getRandomNumberBetween(Utilities.range(0 , 3), true);
    // Array(offSprings).fill(null).map(() => new Firefly()).forEach(ff => {
    //   app.setServicesOnSingleFirefly(ff);
    //   if (Math.random() < .1 ) {
    //     app.markFireflyAsCandidate(ff)
    //     ff.life = Infinity
    //     ff.speedX = 0
    //     ff.speedY = 0
    //   }
    //   ff.initialFireflySnapshot = {
    //     ...ff,
    //     initialFireflySnapshot: null,
    //   }
    //   ff.hue.value = currentFirefly.hue.value;
    //   fireflies.push(ff);
    // })

  }
}