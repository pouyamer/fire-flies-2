import { ServiceName } from "../enums";
import { Firefly } from "../models";
import { ChangingValueKey, FireflyAppApi } from "../types";
import { ChangingValueService } from "./changing-value.service";

type ColorServiceName = ServiceName.Hue | ServiceName.Saturation | ServiceName.Lightness | ServiceName.Alpha;

const HSL_KEYS = [
  'hue', 'saturation', 'lightness', 'alpha'
]

const RGB_KEYS = [
  'red', 'green', 'blue', 'alpha'
];

export class ColorBinderService {

  private readonly fireflies: Firefly[];

  private readonly services: ChangingValueService[];
  constructor(
    private readonly appApi: FireflyAppApi,
  ) {
    this.fireflies = [...appApi.fireflies];

    const colorConfig: any = appApi.app.colorConfigInfo.config;
    const textNames = appApi.app.colorConfigInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS;

    this.services = textNames.map(n => new ChangingValueService(appApi, n as ChangingValueKey<Firefly>, colorConfig[n], n as ServiceName));
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
    const colorBinder = this.appApi.app.colorConfigInfo.config.colorBinder;
    if (colorBinder) {
      this.fireflies.forEach(
        ff => {

          const parameters = this.appApi.app.colorConfigInfo.type === 'HSL' ? {
            hue: ff.hue.value,
            saturation: ff.saturation.value,
            lightness: ff.lightness.value,
            alpha: ff.alpha.value
          } : {
            red: ff.red.value,
            green: ff.green.value,
            blue: ff.blue.value,
            alpha: ff.alpha.value
          };

          const colorFromColorBinder = colorBinder(parameters as any) as any;

          const keys = (this.appApi.app.colorConfigInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS) as ChangingValueKey<Firefly>[];

          keys.forEach((s) => {
            ff[s].set((v) => colorFromColorBinder[s] ?? v)
          });
        }
      )
    }
  }
}