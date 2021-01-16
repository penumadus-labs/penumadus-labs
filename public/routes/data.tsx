import { useState } from 'react'

type Ref = HTMLElement | undefined

interface Route {
  component: (() => JSX.Element) | null
  title: string
  path: string
  active: boolean
  contentSection: boolean
  ref?: Ref
}

export type Routes = Route[]

export const routes: Routes = [
  {
    component: () => <p></p>,
    title: 'Home',
    path: '/',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'Safety & Specifications',
    path: '/#safety',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'Design',
    path: '/#design',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'Process',
    path: '/#process',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'Testing & Data',
    path: '/#data',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'Sensors & Telemetry',
    path: '/#sensors',
    active: false,
    contentSection: true,
  },
  {
    component: null,
    title: 'LIve Video Feed',
    path: '/feed',
    active: false,
    contentSection: false,
  },
  {
    component: null,
    title: 'Admin Login',
    path: 'https://admin.compositebridge.org',
    active: false,
    contentSection: false,
  },
]

const contentRoutes = routes.filter(({ contentSection }) => contentSection)

export type DataHook = [Routes, (route: string) => void]

export const useData = (): DataHook => {
  const [data, setData] = useState(routes)
  const setActive = (route: string) => {
    for (const r of routes) {
      r.active = r.title === route
    }
    setData([...data])
  }
  return [data, setActive]
}
