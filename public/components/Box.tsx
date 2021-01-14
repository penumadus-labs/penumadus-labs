import { objectToCSS, cssObj } from '../utils/css'

export default function Box({ css = {} }: { css: cssObj }) {
  return (
    <>
      <div className="box" />
      <style jsx>{`
        .box {
          position: absolute;
          background: var(--gray);
          z-index: 10;
          ${objectToCSS(css)}
        }
      `}</style>
    </>
  )
}
