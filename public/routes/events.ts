import { RefObject, useEffect, useRef } from 'react'
import { throttle } from '../utils/timeout'
import { Routes, useData } from './data'

type ElementPosition = number
type ElementID = string

type EventResult = [ElementID, ElementPosition]
export type UseAddEvent = (href: ElementID) => RefObject<HTMLDivElement>

export type UseEvents = [Routes, UseAddEvent]

let events: (() => EventResult)[] = []

export const useAddEvent: UseAddEvent = (href: string) => {
  const ref = useRef<HTMLDivElement>(null)
  // change to useLayoutEffect?
  useEffect(() => {
    if (ref.current === null) return

    const event = (): EventResult => [
      href,
      ref.current?.getBoundingClientRect().top ?? Infinity,
    ]

    events.push(event)

    return () => void (events = events.filter(e => e !== event))
  }, [])
  return ref
}

export const useEvents = (): UseEvents => {
  const [data, setActive] = useData()
  // change to useLayoutEffect?
  useEffect(() => {
    const height = 200

    const fireEvents = () => {
      const results = events.map(e => e())

      const [href] = results.slice(1).reduce((res, cur) => {
        const res1 = res[1]
        const cur1 = cur[1]
        return cur1 < height && cur1 > res1 ? cur : res
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

  return [data, useAddEvent]
}
