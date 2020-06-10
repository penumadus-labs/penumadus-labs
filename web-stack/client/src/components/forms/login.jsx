import React, { useState } from 'react'
import Input from '../ui/input'
import { useForm } from 'react-hook-form'
import useAuth from '../../context/auth/context'

export default () => {
  const [, { login }] = useAuth()
  const [error, setError] = useState('')

  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  const handleLogin = (...args) =>
    login(...args).catch((error) => {
      setError(error)
    })

  return (
    <form className="card-spaced" onSubmit={handleSubmit(handleLogin)}>
      <Input name="username" ref={register({})} />
      <Input name="password" ref={register({})} type="password" />
      <button className="button">Login</button>
      {error ? <p className="error">{error}</p> : null}
    </form>
  )
}
