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

const validateTime = (time) =>
  time === '' ||
  new Date(time).getTime() <= Date.now() ||
  'date must not exceed preset'

const formatData = (time) => time && new Date(time).getTime() / 1000

export default ({ useGetData }) => {
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    register,
    clearErrors,
    errors,
  } = useForm()
  const inputCtx = { setValue, errors, clearErrors }

  const [status, request] = useGetData()

  const onSubmit = (data) => {
    request({
      start: formatData(data.start),
      end: formatData(data.end),
    })
  }

  return (
    <Alert buttonText={<GoGear size="20" />}>
      <div className="space-children-y">
        <p>unselected dates default to get the min/max of the data set</p>
        <StyledForm
          onSubmit={handleSubmit(onSubmit)}
          className="space-children-y"
        >
          <SettingInput
            ref={register({
              validate(start) {
                const { end } = getValues()
                if (
                  end !== '' &&
                  new Date(end).getTime() < new Date(start).getTime()
                )
                  return 'start time must not be greater than end time'

                return validateTime(start)
              },
            })}
            name="start"
            label="start time"
            {...inputCtx}
          />
          <SettingInput
            ref={register({
              validate: validateTime,
            })}
            name="end"
            label="end time"
            {...inputCtx}
          />
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
