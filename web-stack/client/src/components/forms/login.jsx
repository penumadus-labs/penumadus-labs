import React, { useState } from 'react'
import Input from '../ui/input'
import { useForm } from 'react-hook-form'
import { useAuthActions } from '../../hooks/use-auth'

export default () => {
  const { login } = useAuthActions()
  const [error, setError] = useState('')

  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  const handleLogin = (...args) =>
    login(...args).catch((error) => {
      // console.error('hi', error.toString())
      setError(error)
    })

  return (
    <div className='card'>
      <form className='space-children-y' onSubmit={handleSubmit(handleLogin)}>
        <Input name='username' ref={register({})} />
        <Input name='password' ref={register({})} type='password' />
        <button className='button'>Login</button>
        {error ? <p className='error'>{error}</p> : null}
      </form>
    </div>
  )
}
