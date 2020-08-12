import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert, { useAlert } from './async-alert'
import Input from '../inputs/input'

export default ({ name, message, settings, useSendCommand, getSettings }) => {
  const { register, handleSubmit } = useForm()
  const [open, bind] = useAlert(false)
  const [[summary, args], setSummary] = useState([null, []])
  const [error, setError] = useState('')

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

    setSummary([summary, args])
    open()
  }

  return (
    <>
      <form className="card-spaced" onSubmit={handleSubmit(submit)}>
        <div className="grid-4">
          {Object.entries(settings).map(([name, value], i) => (
            <div key={i} className="space-children-y-xs">
              <Input
                ref={register()}
                before={<p>currently: {value}</p>}
                name={name}
              />
            </div>
          ))}
        </div>
        <button className="button">{name}</button>
        {error ? <p className="error">{error}</p> : null}
      </form>
      <Alert useRequest={useSendCommand} args={[name, args]} {...bind}>
        {summary}
      </Alert>
    </>
  )
}
