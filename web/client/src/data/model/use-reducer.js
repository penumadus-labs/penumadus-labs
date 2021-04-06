import { scaleLinear } from '@visx/scale'
import { useEffect, useMemo, useReducer } from 'react'
import useMessage from '../../services/socket'
import { dataLimit } from '../../utils/config'
import { throttle } from '../../utils/func'
import * as reducers from './reducers'
import { setDomain } from './reducers'
import * as settingsImport from './settings'
import { getAxisDomains, getDomainTime, mapYScaleSettings } from './utils'

const init = ({ label, data = {} }) => {
  const settings = settingsImport[label]
  const [domainLeft, domainRight] = getAxisDomains(data, settings)
  const domainTime = getDomainTime(data)

  const scaleLeft = scaleLinear({
    domain: domainLeft,
  })

  const scaleRight = scaleLinear({
    domain: domainRight,
  })

  const scaleBrush = scaleTime({
    domain: domainTime,
  })

  const xScale = scaleTime({
    domain: timeDomain,
  })

  mapYScaleSettings(scaleLeft, scaleRight, settings)

  return {
    settings,
    initialData: data,
    data,
    scales: {
      y: {
        left: scaleLeft,
        right: scaleRight,
      },
      x: {
        time: xScale,
        brush: scaleBrush,
      },
    },
    live: {
      live: true,
      data,
    },
    domain: {},
    range: {},
  }
}
// chartRange, brushRange,

// rangeChange, domainChange, domainSlice
// size change, data change, data view change,

// init
// resize (range)
// view/brush (domain-slice)
// view/reset (domain-slice)
// set-live (live, domain)
// message (live, domain)

const reducer = (state, action) => {
  switch (action.type) {
    case 'resize': {
      const range = reducers.setRange(state, action)

      return {
        ...state,
        range,
      }
    }

    case 'brush': {
      const data = reducers.brushData(state, action)

      return {
        ...state,
        data,
        domain: reducers.brushDomain(data, state),
      }
    }

    case 'set-live': {
      const { live } = state
      live.live = !live.live
      const data = liveData
      const domain = reducers.setDomain(data)

      return {
        ...state,
        ...live,
        data,
        domain,
      }
    }

    case 'message': {
      const { live, data: staticData } = state
      live.data.push(action.messageData)
      if (live.data.length > dataLimit) {
        live.data.shift()
      }

      const data = live.live ? live.data : staticData
      const domain = live.live ? setDomain(data) : state.domain

      return {
        ...state,
        live,
        data,
        domain,
      }
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
      dispatch({ type: 'view', subtype: 'reset' })
    }

    const handleBrush = throttle((props) => {
      if (props === null) return
      dispatch({ type: 'view', subtype: 'brush', ...props })
    }, 100)

    const setLive = () => {
      dispatch({ type: 'set-live' })
    }

    const useMount = (width, height) => {
      useEffect(() => {
        if (width !== 0 && height !== 0) {
          dispatch({ type: 'resize', width, height })
        }
      }, [width, height])
    }

    return [{ handleReset, handleBrush, setLive }, { useMount }]
  }, [])

  const { label } = props

  useMessage(
    ({ type, data: messageData }) => {
      console.log(messageData)
      if (type !== label) return
      dispatch({ type: 'message', messageData })
    },
    [label]
  )

  return [state, actions, hooks]
}
