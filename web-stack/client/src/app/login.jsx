import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/inputs/input'

const StyledForm = styled.form`
  width: 200px;
  margin: var(--sm);
`

export default ({ handleLogin, status }) => {
  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  return (
    <StyledForm
      className="card-spaced inline center"
      onSubmit={handleSubmit(({ username, password }) =>
        handleLogin(username, password)
      )}
    >
      <Input name="username" ref={register({})} />
      <Input name="password" ref={register({})} type="password" />
      <button className="button">Login</button>
      {status}
    </StyledForm>
  )
}
