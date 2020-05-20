import { useState, useEffect } from 'react'

export default (initial, af, clean = null) => {
  const [state, setState] = useState(initial)

  useEffect(() => {
    af(setState).catch(console.error)
    if (clean) return clean
  }, [af, setState, clean])

  return state
}
