import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from '../alert-old'
import Input from '../inputs/input'

export default ({ name, message, settings, sendCommand }) => {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const [Summary, setSummary] = useState(null)
  const [args, setArgs] = useState(null)
  const [Alert, open] = useAlert(false)

  const submit = (values) => {
    const formValues = Object.values(values)

    if (formValues.every((value) => value === ''))
      return setError('no values entered')

    const args = []
    const summary = []

    Object.entries(settings).forEach(([name, currentValue], i) => {
      const newValue = formValues[i]

      if (newValue !== '') {
        args.push(newValue)
        summary.push(
          <p key={i}>
            {name}: {currentValue} => {newValue}
          </p>
        )
      } else args.push(currentValue)
    })

    setArgs(args)
    setSummary(summary)
    open()
  }

  const handleAccept = () => sendCommand(undefined, name, args)

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
      <Alert onAccept={handleAccept}>{Summary}</Alert>
    </>
  )
}
