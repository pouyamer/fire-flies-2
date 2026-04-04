import { WindowConfig } from "../types";

export const windowConfig: WindowConfig = {
  mousePositionFuzziness: 10,
  onFireflyMouseOver: ({ canvas, firefly, fireflies }) => {
    // if (canvas.mouseX && canvas.mouseY ) {
    //   firefly.x = canvas.mouseX;
    //   firefly.y = canvas.mouseY;
    // }
  }
};