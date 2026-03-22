import { Firefly, HslColor, InteractiveLine } from "../models";
import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  onSetModifier: ({firefly, fireflies, lines, canvas}) => {




    if (firefly === fireflies[0]) {
    for (let i = 0; i < fireflies.length - 1; i++) {
      console.log(i);

      console.log(fireflies[i + 1].hue.value)
      const line = new InteractiveLine({
          start: fireflies[i],
          end: fireflies[i + 1],
          lineWidth: .005,
        })
      lines.push(line)
    }
    }




  },
  onFramePassModifier: ({firefly, fireflies, lines, canvas}) => {
          //     color: new HslColor({
          //   alpha: fireflies[i + 1].alpha.value,
          //   hue: fireflies[i + 1].hue.value,
          //   saturation: fireflies[i + 1].saturation.value,
          //   lightness: fireflies[i + 1].lightness.value,
          // }).toString(),

    if (firefly === fireflies[0]) {
      lines.forEach(l => {
        if('key' in l.start) {
        l.color = new HslColor({
            alpha: l.start.alpha.value,
            hue: l.start.hue.value,
            saturation: l.start.saturation.value,
            lightness: l.start.lightness.value,
          }).toString()
        }

      })

    }
  }
}