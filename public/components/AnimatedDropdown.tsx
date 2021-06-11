import { FC, useState } from 'react'

const animationDuration = 500

const initialState = {
  opacity: 0,
  position: '-4rem',
}

export const AnimatedDropdown: FC<{
  render: (openDropdown: () => void) => JSX.Element | null
}> = ({ children, render }) => {
  const [open, setOpen] = useState(false)
  const [{ opacity, position }, setTransition] = useState(initialState)

  const openDropdown = () => {
    if (!open) {
      setOpen(true)

      setTimeout(() =>
        setTransition({
          opacity: 1,
          position: '0',
        })
      )
    } else {
      setTransition(initialState)
      setTimeout(() => setOpen(false), animationDuration)
    }
  }

  return (
    <>
      {render(openDropdown)}
      <div className="anchor">
        {open && <div className="dropdown">{children}</div>}
      </div>
      <style jsx>{`
        .anchor {
          position: relative;
        }

        .dropdown {
          position: absolute;
          background: white;
          transition: opacity top;
          transition-duration: ${animationDuration / 1000}s;
          opacity: ${opacity};
          top: ${position};
          width: 100%;
        }
      `}</style>
    </>
  )
}
