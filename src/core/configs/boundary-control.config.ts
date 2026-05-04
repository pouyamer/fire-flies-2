import { DIRECTIONAL_BOUNDARY_CONFIGS } from "../constants";
import { BoundaryControlConfig } from "../types";

export const boundaryControlConfig: BoundaryControlConfig = {
  boundaries: [
    {
      ...DIRECTIONAL_BOUNDARY_CONFIGS.topWithPC,
      onTouched: ({firefly}) => {
        firefly.speedY.set(v => -v / 1.5)
      }
    },
    {
      ...DIRECTIONAL_BOUNDARY_CONFIGS.rightWithPC,
      onTouched: ({firefly}) => {
        firefly.speedX.set(v => -v / 1.5)
      }
    },
    {
      ...DIRECTIONAL_BOUNDARY_CONFIGS.bottomWithPC,
      onTouched: ({firefly}) => {
        firefly.speedY.set(v => -v / 1.1)
      }
    },
    {
      ...DIRECTIONAL_BOUNDARY_CONFIGS.leftWithPC,
      onTouched: ({firefly}) => {
        firefly.speedX.set(v => -v / 1.5)
      }
    },
  ]
}