import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert from '../alert'
import Input from '../input'
import commandBody from './command-body'

export default ({ name, settings, useCommand }) => {
  const settingEntries = Object.entries(settings)

  const { register, handleSubmit, watch } = useForm()
  const [summary, setSummary] = useState()
  const [args, setArgs] = useState()
  const disabled = Object.values(watch()).every((value) => value === '')

  const submit = (formValues) => {
    const values = Object.values(formValues)

    // const args = []
    // const summary = []

    // for (let i = 0; i < values.length; i++) {
    //   const [name, currentValue] = settingEntries[i]
    //   const testValue = values[i]

    //   args.push(testValue || currentValue)

    //   if (args[i] === currentValue) continue

    //   summary.push(
    //     <p key={i}>
    //       {name}: {currentValue} to {testValue}
    //     </p>
    //   )
    // }

    const args = values.map((value, i) => value || settingEntries[i][1])

    const summary = settingEntries.map(
      ([name, value], i) =>
        args[i] !== value && (
          <p key={i}>
            {name}: {value} to {args[i]}
          </p>
        )
    )

    setSummary(summary)
    setArgs(args)
  }

  const inputs = settingEntries.map(([name, value], i) => (
    <div key={i} className="space-children-y-xs">
      <Input className="input" ref={register} placeholder={value} name={name} />
    </div>
  ))

  return (
    <>
      <form className="card-spaced" onSubmit={handleSubmit(submit)}>
        <div className="grid-4">{inputs}</div>
        <Alert
          buttonText={name}
          disabled={disabled}
          render={commandBody(useCommand, [name, args], summary)}
        />
      </form>
    </>
  )
}
