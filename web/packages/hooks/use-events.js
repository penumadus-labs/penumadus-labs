import { useRef, useEffect } from 'react'
export const useEvent = (event, callback, initialize = false) => {
  useEffect(() => {
    const handler = initialize ? callback() : callback
    window.addEventListener(event, handler)
    return () => {
      window.removeEventListener(event, handler)
    }
  }, [event, initialize, callback])
}

export const useResize = (callback) => {
  const ref = useRef()

  const handler = () => {
    let timeout
    callback(ref)
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        callback(ref)
      }, 200)
    }
  }

  useEvent('resize', handler, true)

  return ref
}

export const useEsc = (handler) =>
  useEvent('keydown', ({ keyCode }) => {
    if (keyCode === 27) handler()
  })
