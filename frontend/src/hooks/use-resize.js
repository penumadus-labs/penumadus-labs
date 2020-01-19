import { useState, useEffect } from 'react'

export default () => {
  const [_, rerender] = useState()

  //   console.log('state')

  useEffect(() => {
    // console.log('efect')

    const handleResize = () => {
      //   console.log('i was resized')
      rerender()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      //   console.log('i was removed')
      window.removeEventListener('resize', handleResize)
    }
  })
}
