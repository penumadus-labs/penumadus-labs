import { useCallback, useEffect, useRef } from 'react'

export const useEvent = (event, callback, initialize = false) => {
  useEffect(() => {
    const handler = initialize ? callback() : callback
    window.addEventListener(event, handler)
    return () => {
      window.removeEventListener(event, handler)
    }
    // eslint-disable-next-line
  }, [event, initialize, callback])
}

export const useResize = (callback, deps) => {
  const ref = useRef()

  const handler = useCallback(() => {
    let timeout
    callback(ref)
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        callback(ref)
      }, 200)
    }
    // eslint-disable-next-line
  }, [deps])

  useEvent('resize', handler, true)

  return ref
}

export const useEsc = (handler) =>
  useEvent('keydown', ({ keyCode }) => {
    if (keyCode === 27) handler()
  })
