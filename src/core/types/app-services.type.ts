import { Service } from "../interfaces"

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
