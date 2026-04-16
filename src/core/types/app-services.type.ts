import { FireflyApp } from "../app"
import { Firefly, FireflyCanvas } from "../models"
import { BoundService, ChangingValueService, CollisionService, DrawService, GlobalFireflyModifierService, LifeService, LocationService, NeighbourhoodService, ShapeService, WindowService } from "../services";
import { ColorBinderService } from "../services/color-binder.service";
import { BoundsConfig } from "./bounds-config.type";
import { ChangingValueConfig } from "./changing-value-config.type";
import { CollisionConfig } from "./collision-config.type";
import { DrawConfig } from "./draw-config.type";
import { GeneralFireflyConfig } from "./general-firefly-config.type";
import { GlobalFireflyModifierConfig } from "./global-firefly-modifier-config.type";
import { HslColorConfig } from "./hsl-color-config.type";
import { JitterConfig } from "./jitter-config.type";
import { LifeConfig } from "./life-config.type";
import { Arc, Line } from "./line.type"
import { LocationConfig } from "./location-config.type";
import { NeighbourhoodConfig } from "./neighbourhood-config.type";
import { RgbColorConfig } from "./rgb-color.config.type";
import { ShapeConfig } from "./shape-config.type";
import { SpeedConfig } from "./speed-config.type";
import { WindowConfig } from "./window-config.type";

export type FireflyAppMethods = {
  disposeLine: FireflyApp['disposeLine'];
  addLine: FireflyApp['addLine'];
  disposeArc: FireflyApp['disposeArc'];
  addArc: FireflyApp['addArc'];
  getConfig: FireflyApp['getConfig'];
  resetServicesOnFireflyByKeys: FireflyApp['resetServicesOnFireflyByKeys'];
  resetServicesByKeys: FireflyApp['resetServicesByKeys'];
  haltServicesOnFireflyByKeys: FireflyApp['haltServicesOnFireflyByKeys'];
  addFireflyToService: FireflyApp['addFireflyToService'];
  togglePauseApplication: FireflyApp['togglePauseApplication'];
  markFireflyAsCandidate: FireflyApp['markFireflyAsCandidate'];
  getServiceByKey: FireflyApp['getServiceByKey']
}

export type FireflyColorInfoConfig = 
  { type: 'HSL', config: HslColorConfig } | 
  { type: 'RGB', config: RgbColorConfig }

export interface FireflyAppApi {
  fireflies: Firefly[];
  canvas: FireflyCanvas;
  lines: Line[];
  arcs: Arc[];
  methods: FireflyAppMethods;
  configs: {
    general: GeneralFireflyConfig;
    colorInfo: FireflyColorInfoConfig
  }
}

export type FireflyAppApiGetter =
  (<K extends undefined>(key?: K) => FireflyAppApi) &
  (<K extends keyof FireflyAppApi>(key: K) => FireflyAppApi[K]);

export interface FireflyServiceConfigs {
  bound: BoundsConfig;
  collision: CollisionConfig;
  generalFirefly: GeneralFireflyConfig;
  globalFireflyModifier: GlobalFireflyModifierConfig;
  jitter: JitterConfig;
  location: LocationConfig;
  rotation: ChangingValueConfig;
  shape: ShapeConfig;
  size: ChangingValueConfig;
  speed: SpeedConfig;
  window: WindowConfig;
  neighbourhood: NeighbourhoodConfig;
  draw: DrawConfig;
  life: LifeConfig;
  hslColor: HslColorConfig,
  rgbColor: RgbColorConfig;
}