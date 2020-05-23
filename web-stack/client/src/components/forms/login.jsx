import React from 'react'
import Input from '../ui/input'
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
    <div className='card'>
      <form className='space-children-y' onSubmit={handleSubmit(login)}>
        <Input name='username' ref={register({})} />
        <Input name='password' ref={register({})} type='password' />
        <button className='button'>Login</button>
      </form>
    </div>
  )
}
