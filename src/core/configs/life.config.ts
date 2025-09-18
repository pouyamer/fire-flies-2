import { v4 } from "uuid";
import { LifeConfig } from "../types";

export const lifeConfig: LifeConfig = {
  value: Infinity,
  codeGenerator: () => v4(),
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