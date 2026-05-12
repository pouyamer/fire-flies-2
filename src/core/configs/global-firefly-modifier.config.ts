import { FireflyLine, HslColor } from "../models";
import { GlobalFireflyModifierConfig } from "../types";

export const globalFireflyModifierConfig: GlobalFireflyModifierConfig = {
  update: (api) => {
    const fireflies = api('fireflies');
    const methods = api('methods');
    const lines = api('lines');

    lines.forEach(l => {
      methods.disposeLine(l);

    })


    for (let i = 0; i < fireflies.length; i++) {
      for (let j = i; j < fireflies.length; j++) {
        const newLine = new FireflyLine({
          start: fireflies[i],
          end: fireflies[j],
          lineWidth: 10,
          extendEndBy: 4,
          extendStartBy: 4
        });
        methods.addLine(newLine);

        const alpha = 500 / (newLine.distance + 1) - .5

        if (alpha <= 0) {
          methods.disposeLine(newLine)
        }
        else {
          newLine.color = new HslColor({
            hue: 20,
            lightness: 50,
            saturation: 30,
            alpha
          }).toString()
        }
      }

    }
  }

}