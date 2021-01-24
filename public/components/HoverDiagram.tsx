import { FC } from 'react'

export const HoverDiagram: FC = ({ children }) => {
  return (
    <>
      <div className="relative">
        <img src="test/bridge-diagram.png" alt="test/bridge-diagram.png" />
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
