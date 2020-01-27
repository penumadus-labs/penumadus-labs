import { useState, useEffect } from 'react'
import useDevicesContext from './use-devices-context'
import validate from '../utils/validate-settings'
// import useInput from './use-input'

// const useSetting = ({ name, value: current, unit }) => {
//   const [value, handleChange, reset] = useInput()

//   return {
//     props: {
//       name,
//       current,
//       unit,
//       value,
//       handleChange,
//       warning: validate.value(value, current),
//     },
//     reset,
//   }
// }

// export const useSettings = () => {
//   const [
//     { selected, settingsList },
//     { updateSettings: update },
//   ] = useDevicesContext()

//   if (!selected) settingsList.map(useSetting)

//   const settings = selected
//     ? Object.values(selected.settings).map(useSetting)
//     : null

//   return [settings, update]
// }

export default () => {
  const [
    {
      selected: { settings },
    },
    { updateSettings: update },
  ] = useDevicesContext()

  // const memo = useMemo(() => {
  //   if (!settings) return []

  //   const list = settings.map(({ name, value: current, unit }, index) => ({
  //     name,
  //     current,
  //     unit,
  //     value: '',
  //     warning: '',
  //     handleChange({ target }) {
  //       const self = list[index]
  //       self.value = target.value
  //       self.warning = validate[self.name](self.value, self.current)
  //       setList([...list])
  //     },
  //   }))

  //   return list
  // }, [settings])

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
        handleChange({ target }) {
          const ref = list[index]
          const { name, value, current } = ref
          ref.value = target.value
          ref.warning = validate[name](value, current)
          setList([...list])
        },
      }
    })

    setList(list)
  }, [settings])

  const reset = () => {
    list.forEach(item => (item.value = ''))
    setList([...list])
  }

  return [list, update, reset]
}
