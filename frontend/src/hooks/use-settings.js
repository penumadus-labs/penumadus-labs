import useDevicesContext from './use-devices-context'
import useInput from './use-input'
import * as validate from '../utils/validate-settings'

const useSetting = ({ name, value: current, unit }) => {
  const [value, bind, reset] = useInput()

  return {
    props: {
      name,
      current,
      unit,
      value,
      bind,
      warning: validate.value(value, current),
    },
    reset,
  }
}

export default () => {
  const [
    { selected, settingsList },
    { updateSettings: update },
  ] = useDevicesContext()

  if (!selected) settingsList.map(useSetting)

  const settings = selected
    ? Object.values(selected.settings).map(useSetting)
    : null

  return [settings, update]
}
