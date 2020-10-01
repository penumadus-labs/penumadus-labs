import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from '../alert'
import Input from '../input'
import commandBody from './command-body'

const compareObjects = (obj1, obj2) => {
  for (const [key] of Object.keys(obj1)) {
    if (obj1[key] !== obj2[key]) return false
  }
  return true
}

export default ({ name, settings, useRequest }) => {
  const settingEntries = Object.entries(settings)
  const defaultValues = settingEntries.reduce(
    (a, [name, value]) => ({ ...a, [name]: value }),
    {}
  )

  const { register, handleSubmit } = useForm({ defaultValues })
  const [Alert, open] = useAlert()
  const [[summary, args], setSummary] = useState([null, []])
  const [error, setError] = useState('')

  const submit = (values) => {
    if (compareObjects(values, settings)) return setError('no values entered')

    const args = Object.values(values)

    const summary = settingEntries.reduce(
      (a, [name, currentValue], i) =>
        currentValue === args[i]
          ? a
          : [
              ...a,
              <p key={i}>
                {name}: {currentValue} to {args[i]}
              </p>,
            ],
      []
    )

    setSummary([summary, args])
    open()
  }

  const inputs = settingEntries.map(([name, value], i) => (
    <div key={i} className="space-children-y-xs">
      <Input ref={register()} before={<p>currently: {value}</p>} name={name} />
    </div>
  ))

  return (
    <>
      <form className="card-spaced" onSubmit={handleSubmit(submit)}>
        <div className="grid-4">{inputs}</div>
        <button className="button">{name}</button>
        {error ? <p className="error">{error}</p> : null}
      </form>
      <Alert render={commandBody(useRequest, [name, args], summary)} />
    </>
  )
}
