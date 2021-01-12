import ActivateLinks from '../components/ActivateLinks'
import SideBar from '../components/SideBar'
import ContentArea from '../components/ContentArea'
import * as content from '../utils/dummyText'

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
      <ContentArea title="content area 1" content={content.l200} />
      <ContentArea title="content area 2" content={content.l800} />
      <ContentArea title="content area 3" content={content.l500} />
      <ContentArea title="content area 4" content={content.l400} />
      <ContentArea title="content area 5" content={content.l300} />
      <style jsx>{``}</style>
    </>
  )
}
