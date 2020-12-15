import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/input'

const StyledForm = styled.form`
  display: inline-block;
  padding-right: var(--sm);
  margin: var(--sm);
`

const required = process.env.NODE_ENV !== 'development'

export default ({ handleLogin, status }) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({ mode: 'onChange' })

  // throw new Error('oops')

  return (
    <div>
      <StyledForm
        className="card-spaced"
        onSubmit={handleSubmit(({ username, password }) =>
          handleLogin(username, password)
        )}
      >
        <Input name="username" ref={register({ required })} />
        <Input name="password" ref={register({ required })} type="password" />
        <button className="button" disabled={!isValid}>
          Login
        </button>
        {status}
      </StyledForm>
    </div>
  )
}
