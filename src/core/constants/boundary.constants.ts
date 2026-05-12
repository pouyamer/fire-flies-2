import { BoundaryConfig, BoundaryRules } from "../types";

const TOP_BOUNDARY_CONFIG_RULES: BoundaryRules = {
  out: ({
    yPlusHalfSize,
  }) => yPlusHalfSize <= 0,
  touched: ({ yMinusHalfSize }) => yMinusHalfSize <= 0,
}

const LEFT_BOUNDARY_CONFIG_RULES: BoundaryRules = {
  out: ({
    xPlusHalfSize,
  }) => xPlusHalfSize <= 0,
  touched: ({ xMinusHalfSize }) => xMinusHalfSize <= 0,
}

const BOTTOM_BOUNDARY_CONFIG_RULES: BoundaryRules = {
  out: ({
    yMinusHalfSize,
    canvasHeight
  }) => yMinusHalfSize >= canvasHeight,
  touched: ({ yPlusHalfSize, canvasHeight }) => yPlusHalfSize >= canvasHeight,
}

const RIGHT_BOUNDARY_CONFIG_RULES: BoundaryRules = {
  out: ({
    xMinusHalfSize,
    canvasWidth
  }) => xMinusHalfSize >= canvasWidth,
  touched: ({ xPlusHalfSize, canvasWidth }) => xPlusHalfSize >= canvasWidth,
}

export const DIRECTIONAL_BOUNDARY_CONFIGS: Record<
  | 'topWithPC'
  | 'topWithoutPC'
  | 'bottomWithPC'
  | 'bottomWithoutPC'
  | 'leftWithPC'
  | 'leftWithoutPC'
  | 'rightWithPC'
  | 'rightWithoutPC'
  , BoundaryConfig> = {
    topWithPC: {
      key: 'top',
      rules: TOP_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.y = firefly.size.value / 2
      }
    },
    topWithoutPC: {
      key: 'top',
      rules: TOP_BOUNDARY_CONFIG_RULES,
    },
    bottomWithPC: {
      key: 'bottom',
      rules: BOTTOM_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.y = api('canvas').height - firefly.size.value / 2
      }
    },
    bottomWithoutPC: {
      key: 'bottom',
      rules: BOTTOM_BOUNDARY_CONFIG_RULES,
    },
    leftWithPC: {
      key: 'left',
      rules: LEFT_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly }) => {
        firefly.x = firefly.size.value / 2
      }
    },
    leftWithoutPC: {
      key: 'left',
      rules: LEFT_BOUNDARY_CONFIG_RULES,
    },
        rightWithPC: {
      key: 'right',
      rules: RIGHT_BOUNDARY_CONFIG_RULES,
      touchedPositionCorrector: ({ firefly, api }) => {
        firefly.x = api('canvas').width - firefly.size.value / 2
      }
    },
    rightWithoutPC: {
      key: 'right',
      rules: RIGHT_BOUNDARY_CONFIG_RULES,
    },
  } 