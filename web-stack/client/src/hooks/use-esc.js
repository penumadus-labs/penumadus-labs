import { useEffect } from 'react'

export default (callback) =>
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) callback()
    }

    window.addEventListener('keydown', handleKeyDown)
    console.log('mount')

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
