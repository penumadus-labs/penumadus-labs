import { FC } from 'react'

export const HoverDiagram: FC<{ src: string }> = ({ children, src }) => {
  return (
    <>
      <div className="relative">
        <img src={src} alt={src} />
        {children}
      </div>

      <style jsx>{`
        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      `}</style>
    </>
  )
}
