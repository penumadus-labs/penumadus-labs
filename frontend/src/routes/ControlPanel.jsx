import React, { useState } from 'react'
import Settings from '../components/ui/Settings.jsx'
import Summary from '../components/ui/Summary.jsx'
import useSettings from '../hooks/use-settings'

export default () => {
  // hooks

  const [alert, setAlert] = useState(false)
  const [warning, setWarning] = useState('')
  const [settings, update, reset] = useSettings()

  // methods

  const handleSubmit = e => {
    if (settings.every(props => props.value === '')) {
      setWarning('no valus entered')
    } else if (settings.some(props => props.warning)) {
      setWarning('invalid input')
    } else {
      setWarning('')
      setAlert(true)
    }
  }

  const handleCancel = () => {
    setAlert(false)
  }

  const handleAccept = () => {
    setAlert(false)
    // const result = settings.reduce((acc, { name, current, value, unit }) => {
    //   acc[name] = {
    //     name,
    //     unit,
    //     value: value === '' ? current : +value,
    //   }
    //   return acc
    // }, {})
    const result = settings.map(({ name, current, value, unit }) => ({
      name,
      value: value === '' ? current : +value,
      unit,
    }))
    update(result)
    reset()
  }

  return settings.length ? (
    <>
      <Settings list={settings} onSubmit={handleSubmit} warning={warning} />
      {alert && (
        <Summary
          list={settings}
          onAccept={handleAccept}
          onCancel={handleCancel}
        />
      )}
    </>
  ) : null
}
