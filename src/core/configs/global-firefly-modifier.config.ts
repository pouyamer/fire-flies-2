import { FireflyLine } from "../models";
import { GlobalFireflyModifierConfig } from "../types";
import { calculateDistance } from "../utilities";

const distance = 60

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: () => {},
  onFramePassModifier: ({ firefly, api }) => {
    const fireflies = api('fireflies');
    const lines = api('lines');

    const app = api('app')

    fireflies.filter(ff => ff !== firefly).filter(
      ff => calculateDistance(firefly.x, firefly.y, ff.x, ff.y) <= distance
    ).forEach(ff => {

      if (lines.find(l => (l.start === ff && l.end === firefly) || (l.start === firefly && l.end === ff))) {
        return
      }
      app.addLine(new FireflyLine({
        start: firefly,
        end: ff,
        lineWidth: 1
      }))
    })

    lines.filter(l => l.distance <= distance).forEach(
      l => {
        l.color = `hsl(0, 70%, 65%, ${(distance - l.distance) / distance})`
      }
    )


    lines.filter(l => l.distance > distance).forEach(
      l => {
        app.disposeLine(l)
      }
    )




  }
}