import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GoGear } from 'react-icons/go'
import Alert from '../../alert'
import SettingInput from './setting-input'

const StyledForm = styled.form`
  /* max-width: 16rem; */
  margin: auto;
`

let formDataStore = {
  start: '',
  end: '',
}

export default ({ useGetData }) => {
  const { handleSubmit, reset, setValue, register } = useForm({
    defaultValues: { start: 'hi' },
  })
  const ctx = { setValue, register }
  for (const [name, value] of Object.entries(formDataStore)) {
    setValue(name, value)
  }

  const [status, request, , setError] = useGetData()

  const onSubmit = handleSubmit(async (data) => {
    const start =
      data.start === '' ? undefined : new Date(data.start).getTime() / 1000
    const end =
      data.end === '' ? undefined : new Date(data.end).getTime() / 1000

    const now = new Date(Date.now()).getTime() / 1000

    if (start > now || end > now)
      return setError('values must not exceed the present')

    if (start >= end) return setError('end must come after start')

    try {
      await request({ start, end })
      formDataStore = data
    } catch (error) {}
  })

  return (
    <Alert icon={<GoGear size="20" />}>
      <div className="space-children-y">
        <p>unselected dates default to get the min/max of the data set</p>
        <StyledForm onSubmit={onSubmit} className="space-children-y">
          <SettingInput {...ctx} name="start" />
          <SettingInput {...ctx} name="end" />
          {status}
          <button className="button">submit</button>
        </StyledForm>
        <div className="space-children-x">
          <button className="button-text text-blue" onClick={reset}>
            clear all
          </button>
        </div>
      </div>
    </Alert>
  )
}
