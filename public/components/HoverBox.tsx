import { FC } from 'react'

/**
 * open dropdown with focus
 *
 * or open dropdown with react state, and close with screen cover
 *
 * focus version is not able to be toggled
 *
 * react state blocks any other input until it's clicked
 */

let lastClicked: any

interface blurElement extends Element {
  blur: () => void
}

export const HoverBox: FC<{
  top: string
  left: string
  width: string
  height: string
  round?: boolean
  disabled?: boolean
}> = ({
  top,
  left,
  width,
  height,
  round = false,
  disabled = false,
  children,
}) => {
  // const [open, setOpen] = useState(false)

  // const { useGlobalClick } = useGlobalListener()

  // useGlobalClick(() => {
  //   console.log(open)
  // }, open)

  if (disabled) return null

  return (
    <>
      <div className="absolute box">
        <button
          className="filled sibling"
          onClick={({ target }) => {
            if (lastClicked === target) {
              void (document.activeElement as blurElement).blur()
              lastClicked = null
            } else {
              lastClicked = target
            }
          }}
        />
        <div className="absolute info shadow">{children}</div>
      </div>

      {/* {open ? (
        <div
          className="fixed click-listener"
          onClick={() => {
            console.log('clicked')
            setOpen(false)
          }}
        />
      ) : null} */}
      <style jsx>{`
        .click-listener {
          z-index: 20;
        }
        .box {
          /* border: 1px solid red; */

          position: absolute;
          top: ${top}%;
          left: ${left}%;
          width: ${width}%;
          height: ${height}%;
          border-radius: ${round ? 50 : 0}%;
        }

        .info {
          left: calc(50% - 15rem);
          top: 30%;
          max-height: 90vh;
          width: 30rem;
          background: white;
          padding: 1rem;
          opacity: 0;
          position: fixed;
          transition: opacity 0.2s;
          z-index: 100;
        }

        .sibling {
          position: relative;
          cursor: pointer;
          z-index: 5;
        }

        .sibling:focus {
          outline: none;
        }

        .sibling:hover + .info {
          opacity: 1;
        }
        .sibling:focus + .info {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
