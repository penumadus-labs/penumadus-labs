import React, { useState } from 'react'
import Settings from '../../components/ui/settings'
import Summary from '../../components/ui/summary'
import { Warning } from '../style/components'
import useSettings from '../../hooks/use-settings'

export default () => {
  const [alert, setAlert] = useState(false)
  const [warning, setWarning] = useState('')
  const [error, settings, update, reset] = useSettings()

  const handleSubmit = (e) => {
    if (settings.every((props) => props.value === '')) {
      setWarning('no valus entered')
    } else if (settings.some((props) => props.warning)) {
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

    const result = settings.map(({ name, current, value, unit }) => ({
      name,
      value: value === '' ? current : +value,
      unit,
    }))
    update(result)

    reset()
  }

  if (error) return null

  return settings.length ? (
    <>
      <Settings list={settings} onSubmit={handleSubmit} warning={warning} />
      <div className='card'>
        <button className='button' onClick={handleSubmit}>
          Apply
        </button>
        {warning && <Warning>{warning}</Warning>}
      </div>
      {alert && (
        <Summary
          list={settings}
          onAccept={handleAccept}
          onCancel={handleCancel}
        />
      )}
    </>
  ) : (
    <p>loading</p>
  )
}
