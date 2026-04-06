import { Firefly, FireflyServiceToggleKey } from "../models";
import { ChangingValueKey, FireflyAppApiGetter } from "../types";
import { ChangingValueService } from "./changing-value.service";

const HSL_KEYS = [
  'hue', 'saturation', 'lightness', 'alpha'
]

const RGB_KEYS = [
  'red', 'green', 'blue', 'alpha'
];

export class ColorBinderService {

  private readonly fireflies: Firefly[] = [];

  public readonly services: ChangingValueService[];
  constructor(
    private readonly appApi: FireflyAppApiGetter,
  ) {
    const colorConfig: any = appApi('app').colorConfigInfo.config;
    const textNames = appApi('app').colorConfigInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS;

    this.services = textNames.map(n => new ChangingValueService(appApi, n as ChangingValueKey<Firefly>, colorConfig[n], n as FireflyServiceToggleKey));
  }

  public setOnEveryFirefly(): void {
    this.services.forEach(s => {
      s.setOnEveryFirefly();
    })
  }

  public onFramePass(): void {
    this.services.forEach(s => s.onFramePass());

    const colorBinder = this.appApi('app').colorConfigInfo.config.colorBinder;
    if (colorBinder) {
      this.fireflies.forEach(
        ff => {

          const parameters = this.appApi('app').colorConfigInfo.type === 'HSL' ? {
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

          const keys = (this.appApi('app').colorConfigInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS) as ChangingValueKey<Firefly>[];

          keys.forEach((s) => {
            ff[s].set((v) => colorFromColorBinder[s] ?? v)
          });
        }
      )
    }
  }
}