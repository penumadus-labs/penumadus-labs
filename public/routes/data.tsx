import { ReactChild, useCallback, useState } from 'react'
import * as content from '../utils/contentText'

type Ref = HTMLElement | undefined

interface Route {
  component?: ReactChild
  title: string
  href: string
  active: 'active' | ''
  ref?: Ref
}

export type Routes = Route[]

export const routes: Routes = [
  {
    component: content.home,
    title: 'Home',
    href: '/#home',
    active: '',
  },
  {
    component: content.safety,
    title: 'Safety & Specifications',
    href: '/#safety',
    active: '',
  },
  {
    component: content.design,
    title: 'Design',
    href: '/#design',
    active: '',
  },
  {
    component: content.process,
    title: 'Process',
    href: '/#process',
    active: '',
  },
  {
    component: content.testing,
    title: 'Testing & Data',
    href: '/#testing',
    active: '',
  },
  {
    component: content.sensors,
    title: 'Sensors & Telemetry',
    href: '/#sensors',
    active: '',
  },
  {
    title: 'Live Video Feed',
    href: '/live',
    active: '',
  },
  {
    title: 'Admin Login',
    href: 'https://admin.compositebridge.org',
    active: '',
  },
]

export const useData = (): [Routes, (location: string) => void] => {
  const [data, setData] = useState(routes)

  return [
    data,
    useCallback(
      location =>
        setData(
          routes.map(route => {
            route.active = route.href === location ? 'active' : ''
            return route
          })
        ),
      []
    ),
  ]
}
