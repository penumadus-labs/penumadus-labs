import React, { useState } from 'react'
import Input from '../inputs/input'
import { useForm } from 'react-hook-form'
import useAuth from '../../context/auth/context'
import styled from '@emotion/styled'

const StyledForm = styled.form`
  width: 200px;
  margin: var(--sm);
`

export default () => {
  const [, { login }] = useAuth()
  const [{ loading, error }, setStatus] = useState({})

  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'p@ssw0rd',
    },
  })

  const handleLogin = (...args) => {
    setStatus({ loading: true })
    login(...args).catch((error) => {
      setStatus({ error })
    })
  }

  return (
    <StyledForm
      className="card-spaced inline center"
      onSubmit={handleSubmit(handleLogin)}
    >
      <Input name="username" ref={register({})} />
      <Input name="password" ref={register({})} type="password" />
      <button className="button">Login</button>
      {loading ? <p className="loading">loaidng...</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </StyledForm>
  )
}
