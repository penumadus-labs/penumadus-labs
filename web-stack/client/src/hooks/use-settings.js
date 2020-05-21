import { useState, useEffect } from 'react'
import useDatabase from './use-database'
import validate from '../utils/validate-settings'

export default () => {
  const [
    {
      selected: { settings },
      error,
    },
    { updateSettings: update },
  ] = useDatabase()

  const [list, setList] = useState([])

  useEffect(() => {
    if (!settings) return

    const list = settings.map(({ name, value: current, unit }, index) => {
      return {
        name,
        current,
        unit,
        value: '',
        warning: '',
        handleChange({ target: { value } }) {
          let ref
          const { name, current } = (ref = list[index])

          ref.value = value
          ref.warning = validate[name](value, current)

          setList([...list])
        },
      }
    })

    setList(list)
  }, [settings])

  const reset = () => {
    list.forEach((item) => (item.value = ''))
    setList([...list])
  }

  return [error, list, update, reset]
}
