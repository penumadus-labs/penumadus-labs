import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/input'
import ErrorBoundary from '../components/error-boundary'

const StyledForm = styled.form`
  display: inline-block;
  padding-right: var(--sm);
`

const Container = styled.div`
  margin: var(--sm);
`

const required = process.env.NODE_ENV !== 'development'

export default function Login({ handleLogin, status }) {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({ mode: 'onChange' })

  return (
    <Container>
      <ErrorBoundary card={true} message="login form has crashed">
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
      </ErrorBoundary>
    </Container>
  )
}
