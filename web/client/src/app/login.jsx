import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/input'
import ErrorBoundary from '../components/error-boundary'

const Card = styled.form`
  padding: 2rem 6rem;
  margin: 0 auto;
`

const Container = styled.div`
  height: 60%;
  display: grid;
  place-items: center;
`

const required = process.env.NODE_ENV !== 'development'

export default function Login({ handleLogin, status }) {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({ mode: 'onChange' })

  return (
    <ErrorBoundary card={true} message="login form has crashed">
      <Container>
        <Card className="card">
          <h1>Morgan Bridge</h1>
          <form
            className="space-children-y"
            onSubmit={handleSubmit(({ username, password }) =>
              handleLogin(username, password)
            )}
          >
            <Input name="username" ref={register({ required })} />
            <Input
              name="password"
              ref={register({ required })}
              type="password"
            />
            <button className="button" disabled={!isValid}>
              Login
            </button>
            {status}
          </form>
        </Card>
      </Container>
    </ErrorBoundary>
  )
}
