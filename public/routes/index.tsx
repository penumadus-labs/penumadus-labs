import { useRouter } from 'next/dist/client/router'
import {
  createContext,
  ReactChildren,
  useContext,
  useRef,
  useState,
  useEffect,
  MutableRefObject,
} from 'react'

type Ref = HTMLElement | undefined

interface Route {
  component: (() => JSX.Element) | null
  title: string
  path: string
  active: boolean
  contentSection: boolean
  ref?: Ref
}

type Routes = Route[]

const routes: Routes = [
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

const RouteContext = createContext<
  [Routes, (route: Route) => MutableRefObject<Ref>] | null
>(null)

export const RouteProvider = ({ children }: { children: ReactChildren }) => {
  const { pathname } = useRouter()
  const [context, setState] = useState(routes)

  useEffect(() => {
    const setActiveLink = () => {
      let currentRoute = routes.find(({ path }) => path === pathname)

      let max = -Infinity
      if (!currentRoute)
        for (const route of contentRoutes) {
          if (!route.ref) return
          const { top } = route.ref.getBoundingClientRect()

          if (!route.contentSection) continue

          if (top - 200 <= 0 && top > max) {
            max = top
            currentRoute = route
          }
        }

      for (const { ref } of routes) {
        if (ref === currentRoute?.ref) ref?.classList.add('active')
        else ref?.classList.remove('active')
      }
    }
    if (process.browser) window.onload = setActiveLink

    let timeout: NodeJS.Timeout | null

    const throttleInterval = 100

    window.onscroll = () => {
      if (!timeout)
        timeout = setTimeout(() => {
          setActiveLink()
          timeout = null
        }, throttleInterval)
    }
  })

  const useAttachRoute = (route: Route) => {
    const ref = useRef<HTMLElement>()
    useEffect(() => {
      route.ref = ref.current
    }, [])
    return ref
  }
  return (
    <RouteContext.Provider value={[context, useAttachRoute]}>
      {children}
    </RouteContext.Provider>
  )
}

export default function useRoutes() {
  return useContext(RouteContext)
}
