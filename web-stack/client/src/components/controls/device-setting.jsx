import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../input'
import Command from './command'

export default ({ name, settings, useCommand }) => {
  const { register, handleSubmit, watch } = useForm()
  const [changes, setChanges] = useState({})
  const [data, setData] = useState()
  const disabled = Object.values(watch()).every((value) => value === '')

  const callback = () => setChanges({})

  const submit = (data) => {
    const changes = {}

    for (const [name, value] of Object.entries(data)) {
      if (value === '') data[name] = settings[name]
      else changes[name] = value
    }

    setChanges(changes)
    setData(data)
  }

  const inputs = Object.entries(settings).map(([name, value], i) => (
    <div key={i} className="space-children-y-xs">
      <Input className="input" ref={register} placeholder={value} name={name} />
    </div>
  ))

  return (
    <>
      <form className="card-spaced" onSubmit={handleSubmit(submit)}>
        <div className="grid-4">{inputs}</div>
        <Command {...{ disabled, name, data, useCommand, callback }}>
          {Object.entries(changes).map(([name, value]) => (
            <p key={name}>
              {name}: {settings[name]} to {value}
            </p>
          ))}
        </Command>
      </form>
    </>
  )
}
