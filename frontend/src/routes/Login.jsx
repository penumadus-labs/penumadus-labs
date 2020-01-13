import React from 'react'
import useInput from '../hooks/use-input'
import { handleLogin } from '../auth/auth'

export default () => {
  const [username, bindUsername] = useInput('user')
  const [password, bindPassword] = useInput('pass')

  const handleSubmit = e => {
    e.preventDefault()
    handleLogin({ username, password })
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit}>
        <label htmlFor='username'>
          username:
          <br />
          <input type='text' name='username' {...bindUsername} />
        </label>
        <br />
        <label htmlFor='password'>
          password:
          <br />
          <input type='password' name='password' {...bindPassword} />
        </label>
        <input type='submit' value='log in' />
      </form>
    </>
  )
}
