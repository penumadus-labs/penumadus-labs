import { useState, useEffect } from 'react'

export default (initial, callback, clean) => {
  const [state, setState] = useState(initial)

  useEffect(() => {
    callback(setState)
    if (clean) return clean
  }, [callback, setState, clean])

  return state
}
