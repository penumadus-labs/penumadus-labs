import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/input'

const StyledForm = styled.form`
  width: 200px;
  margin: var(--sm);
`

export default ({ handleLogin, status }) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
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
      <Input name="username" ref={register({ required: true })} />
      <Input
        name="password"
        ref={register({ required: true })}
        type="password"
      />
      <button className="button" disabled={!isValid}>
        Login
      </button>
      {status}
    </StyledForm>
  )
}
