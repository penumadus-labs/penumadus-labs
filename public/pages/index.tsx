import ActivateLinks from '../components/ActivateLinks'
import SideBar from '../components/SideBar'
import ContentArea from '../components/ContentArea'
import * as content from '../utils/contentText'

export default function Home() {
  return (
    <>
      <ActivateLinks />
      <SideBar />
      <div className="responsive-iframe-container">
        <iframe
          src="https://www.youtube-nocookie.com/embed/pSOBWOKEmJE"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
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
