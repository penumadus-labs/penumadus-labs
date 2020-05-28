import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from '../ui/alert'
import Input from '../ui/input'

export default ({ name, message, settings, sendCommand }) => {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const [Summary, setSummary] = useState(null)
  const [args, setArgs] = useState(null)
  const [Alert, open, close] = useAlert(false)

  const submit = (values) => {
    const formValues = Object.values(values)
    if (formValues.every((value) => value === '')) setError('no values entered')
    else {
      const settingEntries = Object.entries(settings)
      setSummary(
        <div>
          {settingEntries.map(([name, currentValue], i) => {
            const newValue = formValues[i]
            return newValue !== '' ? (
              <p key={i}>
                {name}: {currentValue} => {newValue}
              </p>
            ) : null
          })}
        </div>
      )
      setArgs(
        settingEntries.map(([, currentValue], i) => {
          const newValue = formValues[i]
          return +(newValue === '' ? currentValue : newValue)
        })
      )
      open()
    }
  }

  const handleAccept = () => sendCommand(name, args)

  return (
    <>
      <form className="card-spaced" onSubmit={handleSubmit(submit)}>
        <div className="grid-4">
          {Object.entries(settings).map(([name, value], i) => (
            <div key={i} className="space-children-y-xs">
              <Input
                ref={register()}
                before={<p>Currently: {value}</p>}
                name={name}
              />
            </div>
          ))}
        </div>
        <button className="button">{name}</button>
        {error ? <p className="error">{error}</p> : null}
      </form>
      <Alert onAccept={handleAccept} onCancel={close}>
        {Summary}
      </Alert>
    </>
  )
}
