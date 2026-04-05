import { FireflyArc } from "../models";
import { GlobalFireflyModifierConfig } from "../types";
import { calculateDistance } from "../utilities";

const distance = 100

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: () => {},
  onFramePassModifier: ({ firefly, fireflies, arcs, app }) => {

    fireflies.filter(ff => ff !== firefly).filter(
      ff => calculateDistance(firefly.x, firefly.y, ff.x, ff.y) <= distance
    ).forEach(ff => {

      if (arcs.find(l => (l.start === ff && l.end === firefly) || (l.start === firefly && l.end === ff))) {
        return
      }
      app.addArc(new FireflyArc({
        start: firefly,
        end: ff,
        lineWidth: 2
      }))
    })

    arcs.filter(l => l.distance <= distance).forEach(
      l => {
        l.color = `hsl(0, 70%, 65%, ${(distance - l.distance) / distance})`
      }
    )


    arcs.filter(l => l.distance > distance).forEach(
      l => {
        app.disposeArc(l)
      }
    )




  }
}