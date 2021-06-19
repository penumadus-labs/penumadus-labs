import { FC } from 'react'
import { UseAddEvent } from '../routes/events'

export const ContentArea: FC<{
  title: string
  href: string
  useAddEvent: UseAddEvent
}> = ({ children, title, href, useAddEvent }) => {
  const ref = useAddEvent(href)
  return (
    <>
      <div ref={ref} id={href.slice(2)} className="content-area">
        {/* <Box
          css={{
            height: '16rem',
            width: '100%',
          }}
        /> */}
        <section className="p">
          <div className="hidden-small">
            <h1 className="title">{title}</h1>
          </div>
          {children}
        </section>
      </div>
      <style jsx>{`
        .content-area {
        }

        p {
        }
      `}</style>
    </>
  )
}
