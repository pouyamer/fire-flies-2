import { Firefly } from "./firefly.model";

export class FireflyTrail {
  shapeValue: Firefly['shapeValue'];
  x: Firefly['x'];
  y: Firefly['y'];
  drawMethod: Firefly['drawMethod'];
  size: number;
  strokeLineWidth: Firefly['strokeLineWidth'];
  hue: number;
  saturation: number;
  lightness: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  rotation: number;

  constructor(firefly: Firefly) {
    const {
      shapeValue,
      x, 
      y, 
      drawMethod, 
      size, 
      strokeLineWidth,
      hue,
      saturation, 
      lightness, 
      red, 
      green, 
      blue, 
      alpha,
      rotation,
    } = firefly;

      this.shapeValue = shapeValue;
      this.x = x;
      this.y = y;
      this.drawMethod = drawMethod;
      this.size = size.value;
      this.strokeLineWidth = strokeLineWidth;
      this.hue = hue.value;
      this.saturation = saturation.value;
      this.lightness = lightness.value;
      this.red = red.value;
      this.green = green.value;
      this.blue = blue.value;
      this.alpha = alpha.value;
      this.rotation = rotation.value;

  }

}