import { useEffect } from 'react'
import { throttle } from '../utils/timeout'
import { useData } from './data'

type ElementPosition = number
type ElementID = string

type EventResult = [ElementID, ElementPosition]
type Event = () => EventResult
type EffectCleanUp = () => void
export type AddEvent = (event: Event) => EffectCleanUp

let events: Event[] = []

export const addEvent: AddEvent = event => {
  events.push(event)
  return () => void (events = events.filter(e => e !== event))
}

export const useEvents = () => {
  const [data, setActive] = useData()

  useEffect(() => {
    const height = -400

    const fireEvents = () => {
      const results = events.map(e => e())

      const [href] = results.slice(1).reduce((res, cur) => {
        const res1 = res[1]
        const cur1 = cur[1]
        return res1 < height && cur1 > res1 ? cur : res
      }, results[0])

      setActive(href)
    }

    window.onload = () => {
      const { pathname, hash } = window.location
      if (hash) fireEvents()
      else setActive(pathname === '/' ? '/#home' : pathname)
    }

    window.onscroll = throttle(() => fireEvents(), 300)
  }, [])

  return data
}
