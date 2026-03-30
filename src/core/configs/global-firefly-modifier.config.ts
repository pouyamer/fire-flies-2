import { FireflyConnectorLine } from "../models";
import { GlobalFireflyModifierConfig } from "../types";
import { Utilities } from "../utilities";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: ({ firefly, fireflies, lines, canvas }) => {





    if (firefly === fireflies[0]) {

      for (let i = 0; i < fireflies.length; i++) {

        const line = new FireflyConnectorLine({
          start: fireflies[i],
          end: fireflies[i + 1] ? fireflies[i + 1] : fireflies[0],
        })
        lines.push(line)

      }

      console.log(lines)

    }




  },
  onFramePassModifier: ({ firefly, fireflies, lines, canvas, app }) => {
    //     color: new HslColor({
    //   alpha: fireflies[i + 1].alpha.value,
    //   hue: fireflies[i + 1].hue.value,
    //   saturation: fireflies[i + 1].saturation.value,
    //   lightness: fireflies[i + 1].lightness.value,
    // }).toString(),


    // console.log(lines)





    fireflies.filter(ff => ff !== firefly).filter(
      ff => Utilities.calculateDistance(firefly.x, firefly.y, ff.x, ff.y) <= 85
    ).forEach(ff => {

      if (lines.find(l => (l.start === ff && l.end === firefly) || (l.start === firefly && l.end === ff))) {
        return
      }
      app.addLine(new FireflyConnectorLine({
        start: firefly,
        end: ff,
        lineWidth: 1
      }))
    })

    lines.filter(l => l.length <= 85).forEach(
      l => {
        l.color = `hsl(0, 70%, 65%, ${(85 - l.length) / 85})`
      }
    )


    lines.filter(l => l.length > 85).forEach(
      l => {
        app.disposeLine(l)
      }
    )




  }
}