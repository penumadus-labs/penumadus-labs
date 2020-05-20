// unused

import { useState } from 'react'

const useInput = (initial = '') => {
  const [value, setValue] = useState(initial)

  const reset = () => setValue('')

  const bind = {
    value,
    onchange: ({ target }) => {
      setValue(target.value)
    },
  }

  return [bind, reset]
}

export default useInput
