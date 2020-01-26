import { useState } from 'react'

const useInput = (initial = '') => {
  const [value, setValue] = useState(initial)

  const reset = () => setValue('')

  return [
    value,
    ({ target }) => {
      setValue(target.value)
    },
    reset,
  ]
}

export default useInput
