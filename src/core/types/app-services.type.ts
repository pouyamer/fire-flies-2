import { FireflyApp } from "../app"
import { Service } from "../interfaces"
import { Firefly, FireflyCanvas } from "../models"

export type AppServices =
  | {
    frameServices: Service[],
    frameUpdateIndex?: number
  }
  | {
    frameServices: {
      service: Service,
      frameUpdateIndex?: number
    }[]
  }
  | {
    intervalServices: Service[],
    interval_MS?: number
  }
  | {
    intervalServices: {
      service: Service,
      interval_MS?: number
    }
  }

  export interface FireflyAppApi {
    fireflies: Firefly[],
    canvas: FireflyCanvas,
    app: FireflyApp,
  }
