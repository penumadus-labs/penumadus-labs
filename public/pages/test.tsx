import { FC } from 'react'

const Box: FC<{
  top: string
  left: string
  width: string
  height: string
}> = ({ top, left, width, height, children }) => {
  return (
    <>
      <div className="absolute box box1">
        <div className="relative filled">
          <div className="filled sibling" />
          <div className="absolute info">{children}</div>
        </div>
      </div>
      <style jsx>{`
        .box1 {
          border: 1px solid black;
          position: absolute;
          top: ${top}%;
          left: ${left}%;
          width: ${width}%;
          height: ${height}%;
        }

        .info {
          left: calc(50% - 6rem);
          top: 50%;
          width: 12rem;
          background: white;
          padding: 1rem;
          opacity: 0;
          position: absolute;
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

const box1 = {
  top: '36%',
  left: '31%',
  width: '10.5%',
  height: '17.4%',
}

export default function Test() {
  return (
    <>
      <div className="relative">
        <img src="test/bridge-diagram.png" alt="test/bridge-diagram.png" />
        {/* <Box top="" left="" width="" height=""></Box> */}
        <Box top="36" left="31" width="10.5" height="17.4">
          <p>test1</p>
        </Box>
        <Box top="45" left="16.3" width="8.5" height="14">
          <p>test2</p>
        </Box>
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
