import ContentArea from '../components/ContentArea'
import * as content from '../utils/contentText'

export default function Home() {
  return (
    <>
      <ContentArea title="Home" content={content.home} />
      <ContentArea title="Safety & Specifications" content={content.safety} />
      <ContentArea title="Design" content={content.design} />
      <ContentArea title="Process" content={content.process} />
      <ContentArea title="Testing & Data" content={content.testing} />
      <ContentArea title="Sensors & Telemetry" content={content.sensors} />

      <style jsx>{``}</style>
    </>
  )
}
