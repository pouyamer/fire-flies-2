import { FireflyApp } from "../app";
import { ServiceName } from "../enums";
import { Firefly, FireflyCanvas } from "../models";
import { HslColorConfig } from "../types";
import { ChangingValueService } from "./changing-value.service";

type ColorServiceName = ServiceName.Hue | ServiceName.Saturation | ServiceName.Lightness | ServiceName.Alpha;

export class ColorBinderService {

  private readonly fireflies: Firefly[];

  private readonly textNames = [
    'hue',
    'saturation',
    'lightness',
    'alpha'
  ] as const;

  private readonly services: ChangingValueService[];
  constructor(
    private readonly canvas: FireflyCanvas,
    fireflies: Firefly[],
    private readonly config: HslColorConfig,
    app: FireflyApp
  ) {
    this.fireflies = [...fireflies];

    this.services = this.textNames.map(n => new ChangingValueService(n, this.canvas, this.fireflies, config[n], n as ServiceName, app)); 
  }

  public setOnEveryFirefly(): void {
    this.services[0].setOnEveryFirefly();
    this.services[1].setOnEveryFirefly();
    this.services[2].setOnEveryFirefly();
    this.services[3].setOnEveryFirefly();
  }

  public addFireflies(ff: Firefly[]): void;
  public addFireflies(ff: Firefly[], serviceName: ColorServiceName): void;
  public addFireflies(ff: Firefly[], serviceName?: ColorServiceName): void {
    if (serviceName) {
      this.services.find(s => s.name === serviceName)?.addFireflies(ff);
    }
    else {
      this.services.forEach(s => s.addFireflies(ff));
    }
  }

  public removeFireflies(ff: Firefly[]): void;
  public removeFireflies(ff: Firefly[], serviceName: ColorServiceName): void;
  public removeFireflies(ff: Firefly[], serviceName?: ColorServiceName): void {
    if (serviceName) {
      this.services.find(s => s.name === serviceName)?.removeFireflies(ff);
    }
    else {
      this.services.forEach(s => s.removeFireflies(ff));
    }
  }

  public onFramePass(): void {
    this.services.forEach(s => s.onFramePass());
    this.fireflies.forEach(
      ff => {

        const hslFromColorBinder = this.config.colorBinder?.({
          hue: ff.hue.value,
          saturation: ff.saturation.value,
          lightness: ff.lightness.value,
          alpha: ff.alpha.value
        }) ?? {};

        ([
          'hue',
          'saturation',
          'lightness',
          'alpha'
        ] as const).forEach(s => {
          ff[s].value = hslFromColorBinder[s] ?? ff[s].value;
        });
      }
    )
  }
}