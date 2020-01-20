import useInput from './use-input'
import * as validate from '../utils/validate-value'

const settings = {
  value1: 10,
  value2: 20,
  value3: 30,
  value4: 40,
  value5: 50,
  value6: 60,
  value7: 70,
  value8: 80,
}

export default name => {
  const [value, bind, reset] = useInput()

  const current = settings[name]

  return {
    props: {
      name,
      value,
      current,
      bind,
      unit: 'unit',
      warning: validate.value(value, current),
    },
    reset,
  }
}
