import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alert from '../components/alert'
import RegisterBody from '../components/register/register-body'
import Input from '../components/input'

export default () => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  })
  const [postData, setPostData] = useState({})

  const onSubmit = (data) => {
    setPostData(data)
  }

  return (
    <>
      <form
        className="card space-children-y-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          ref={register({ required: `device id is required` })}
          name="id"
          label="device id"
        />
        <Alert
          disabled={!isValid}
          buttonText="submit"
          title="registration summary"
          render={({ close }) => <RegisterBody {...{ close, postData }} />}
        />
      </form>
    </>
  )
}
