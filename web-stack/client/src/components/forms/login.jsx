import React from 'react'
import Input from '../ui/input'
import Button from '../ui/button'
import { useForm } from 'react-hook-form'
import { useAuthActions } from '../../hooks/use-auth'
import styled from 'styled-components'

export default () => {
  const { login } = useAuthActions()
  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  const Root = styled.form`
    ${({ theme }) => theme.mixins.card}
    > *:not(:first-child) {
      margin-top: ${({ theme }) => theme.spacing.lg};
    }
    max-width: 400px;
  `

  return (
    <Root onSubmit={handleSubmit(login)}>
      <Input name='username' ref={register({})} />
      <Input name='password' ref={register({})} type='password' />
      <Button>login</Button>
    </Root>
  )
}
