import { ContentArea } from '../components/ContentArea'
import { useRoutes } from '../routes'
/**
 * content components are in routes/data.tsx
 */
export default function Home() {
  const [routes, useAddEvent] = useRoutes()

  return routes.map(
    ({ title, href, component = null }, i) =>
      component && (
        <ContentArea key={i} {...{ title, href, useAddEvent }}>
          {component}
        </ContentArea>
      )
  )
}
