import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from '../components/alert'
import registerBody from '../components/register/register-body'
import RegisterInput from '../components/register/register-input'

export default () => {
  const { handleSubmit, ...inputCtx } = useForm()
  const [Alert, open] = useAlert()
  const [postData, setPostData] = useState({})

  const onSubmit = (data) => {
    open()
    setPostData(data)
  }

  return (
    <>
      <form
        className="card space-children-y-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RegisterInput name="id" {...inputCtx} />
        {/* <RegisterInput name="name" {...inputCtx} /> */}
        <button className="button">submit</button>
      </form>
      <Alert title="registration summary" render={registerBody({ postData })} />
    </>
  )
}
