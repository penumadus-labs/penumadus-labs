import { ContentArea } from '../components/ContentArea'
import { useRoutes } from '../routes'
import * as content from '../utils/contentText'

export default function Home() {
  const [routes] = useRoutes()
  return (
    <>
      {/* <ContentArea title="Home" content={content.home} />
      <ContentArea title="Safety & Specifications" content={content.safety} />
      <ContentArea title="Design" content={content.design} />
      <ContentArea title="Process" content={content.process} />
      <ContentArea title="Testing & Data" content={content.testing} />
      <ContentArea title="Sensors & Telemetry" content={content.sensors} /> */}

      {routes?.map(
        ({ title, href, component = null }, i) =>
          component && (
            <ContentArea key={i} title={title} href={href}>
              {component}
            </ContentArea>
          )
      )}

      <style jsx>{``}</style>
    </>
  )
}
