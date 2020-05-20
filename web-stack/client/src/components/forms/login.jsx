import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuthActions } from '../../hooks/use-auth'
export default () => {
  const { login } = useAuthActions()
  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  return (
    <form onSubmit={handleSubmit(login)}>
      <input name='username' ref={register({})} />
      <input type='password' name='password' ref={register({})} />
      <button>login</button>
    </form>
  )
}
