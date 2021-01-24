import { FC } from 'react'

export const HoverBox: FC<{
  top: string
  left: string
  width: string
  height: string
  round?: boolean
}> = ({ top, left, width, height, round = false, children }) => {
  return (
    <>
      <div className="absolute box">
        <div className="filled sibling" />
        <div className="absolute info">{children}</div>
      </div>
      <style jsx>{`
        .box {
          border: 1px solid red;
          position: absolute;
          top: ${top}%;
          left: ${left}%;
          width: ${width}%;
          height: ${height}%;
          border-radius: ${round ? 50 : 0}%;
        }

        .info {
          left: calc(50% - 6rem);
          top: 50%;
          width: 12rem;
          background: white;
          padding: 1rem;
          opacity: 0;
          position: absolute;
          transition: opacity 0.2s;
        }

        .sibling {
          position: relative;
          z-index: 5;
        }

        .sibling:hover + .info {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
