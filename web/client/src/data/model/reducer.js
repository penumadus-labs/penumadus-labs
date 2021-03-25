import { useEffect, useMemo, useReducer } from 'react'
import { throttle } from '../../utils/func'
import { filterData, resizeChart, changeView, resizeBrush } from './mutators'
import * as settingsImport from './settings'
import { getExtentTime, getObjectExtent } from './utils'

const init = ({ label, data = {} }) => {
  const settings = settingsImport[label]
  const { extentLeft, extentRight } = getObjectExtent(data, settings)

  return {
    persistent: {
      initialData: data,
      brushDomain: getExtentTime(data),
      extentLeft,
      extentRight,
    },
    live: true,
    realtimeData: [],
    data,
    settings,
    brush: {},
    view: {
      timeDomainString: '',
    },
    size: {},
  }
}

const reducer = (state, { type, ...action }) => {
  switch (type) {
    case 'resize': {
      const { width, height } = action
      const { data } = state

      const size = resizeChart(width, height)
      const brush = resizeBrush(width, height, state.persistent.brushDomain)
      const view = changeView(data, state.settings, size, state.persistent)

      return {
        ...state,
        brush,
        size,
        view,
      }
    }

    case 'brush': {
      const { x0, x1 } = action

      const data = filterData(state.persistent.initialData, { x0, x1 })
      const view = changeView(
        data,
        state.settings,
        state.size,
        state.persistent
      )

      return {
        ...state,
        data,
        view,
      }
    }

    case 'reset': {
      const data = state.persistent.initialData

      const view = changeView(
        data,
        state.settings,
        state.size,
        state.persistent
      )

      return {
        ...state,
        data,
        view,
      }
    }

    case 'data':
      return { ...state }

    case 'set-live':
      return {
        ...state,
        live: !state.live,
      }

    default:
      console.warn('unimplemented state')
      return { ...state }
  }
}

export const useChartReducer = ({ width, height, ...props }) => {
  const [state, dispatch] = useReducer(reducer, props, init)

  const [actions, hooks] = useMemo(() => {
    const handleReset = () => {
      dispatch({ type: 'reset' })
    }

    const handleBrush = throttle((props) => {
      if (props === null) return
      dispatch({ type: 'brush', ...props })
    }, 100)

    const setLive = () => {
      dispatch({ type: 'set-live' })
    }

    // const resize = throttle((width, height) => {
    //   if (width !== 0 && height !== 0) {
    //     dispatch({ type: 'resize', width, height })
    //   }
    // }, 0)

    const useMount = (width, height) => {
      useEffect(() => {
        if (width !== 0 && height !== 0) {
          dispatch({ type: 'resize', width, height })
        }
      }, [width, height])
    }

    return [{ handleReset, handleBrush, setLive }, { useMount }]
  }, [])

  return [state, actions, hooks]
}
