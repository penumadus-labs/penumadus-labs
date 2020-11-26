import { useEffect } from 'react'
export default (event, handler) => {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => {
      window.removeEventListener(event, handler)
    }
  }, [])
}

export const useEsc = (callback) =>
  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (keyCode === 27) callback()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
