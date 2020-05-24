import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert, { useAlert } from '../ui/alert'
import Input from '../ui/input'

const currentValues = [1, 2, 3, 4, 5, 6, 7, 8]

const settings = [
  'setting1',
  'setting2',
  'setting3',
  'setting4',
  'setting5',
  'setting6',
  'setting7',
  'setting8',
]

export default ({ name, message, settings, sendCommand }) => {
  console.log(settings)
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const [isOpen, open, close] = useAlert(false)

  const submit = (values) => {
    if (Object.values(values).every((value) => value === ''))
      setError('no values entered')
    else open()
  }

  const handleAccept = () => sendCommand(name)

  return (
    <>
      <form className="card" onSubmit={handleSubmit(submit)}>
        <p>{name}</p>
        <div className="flex-4">
          {Object.entires(settings).map(([name, value], i) => (
            <div key={i}>
              Current Value: {value}
              <Input ref={register()} name={name} />
            </div>
          ))}
        </div>
        <button className="button">Submit</button>
        {error ? <p className="error">{error}</p> : null}
      </form>
      {isOpen ? <Alert onAccept={handleAccept} onCancel={close} /> : null}
    </>
  )
}
