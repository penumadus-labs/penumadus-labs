import { useState } from 'react'

const useInput = (initial = '') => {
  const [value, setValue] = useState(initial)

  const reset = () => setValue('')

  return [
    value,
    {
      value,
      onChange(e) {
        setValue(e.target.value)
      },
    },
    reset,
  ]
}

export default useInput
