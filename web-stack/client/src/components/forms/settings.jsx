import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Alert from '../ui/alert'
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

export default () => {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const [alert, setAlert] = useState(false)

  const submit = (values) => {
    console.log(values)
    // if (Object.values(values).every((value) => value === ''))
    //   setError('no values entered')
    // else
    setAlert(true)
  }

  const handleAccept = () => setAlert(false)
  const handleCancel = () => setAlert(false)

  return (
    <>
      <form className='card' onSubmit={handleSubmit(submit)}>
        <div className='flex-4'>
          {settings.map((setting, i) => (
            <div key={i}>
              Current Value: {currentValues[i]}
              <Input ref={register()} name={setting} />
            </div>
          ))}
        </div>
        <button className='button'>Submit</button>
        {error ? <p className='error'>{error}</p> : null}
      </form>
      {alert ? <Alert onAccept={handleAccept} onCancel={handleCancel} /> : null}
    </>
  )
}
