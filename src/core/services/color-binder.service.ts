import { MutatorGroup } from "../interfaces";
import { Firefly, FireflyServiceToggleKey } from "../models";
import { ChangingValueKey, FireflyAppApiGetter } from "../types";
import { ChangingValueService } from "./changing-value.service";

const HSL_KEYS = [
  'hue', 'saturation', 'lightness', 'alpha'
]

const RGB_KEYS = [
  'red', 'green', 'blue', 'alpha'
];

export class ColorBinderService implements MutatorGroup {

  private readonly fireflies: Firefly[] = [];

  public readonly services: ChangingValueService[];
  constructor(
    private readonly appApi: FireflyAppApiGetter,
  ) {
    const colorConfig: any = appApi('configs').colorInfo.config;
    const textNames = appApi('configs').colorInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS;

    this.services = textNames.map(n => new ChangingValueService(appApi, n as ChangingValueKey<Firefly>, colorConfig[n], n as FireflyServiceToggleKey));
  }

  public set(): void {
    this.services.forEach(s => {
      s.set();
    })
  }

  public update(): void {
    this.services.forEach(s => s.update());

    const colorBinder = this.appApi('configs').colorInfo.config.colorBinder;
    if (colorBinder) {
      this.fireflies.forEach(
        ff => {

          const parameters = this.appApi('configs').colorInfo.type === 'HSL' ? {
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

          const keys = (this.appApi('configs').colorInfo.type === 'HSL' ? HSL_KEYS : RGB_KEYS) as ChangingValueKey<Firefly>[];

          keys.forEach((s) => {
            ff[s].set((v) => colorFromColorBinder[s] ?? v)
          });
        }
      )
    }
  }
}