import styled from '@emotion/styled'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GoGear } from 'react-icons/go'
import SettingInput from './setting-input'
import Request from '../chart/controls/request'

const StyledForm = styled.form`
  /* max-width: 16rem; */
  margin: auto;
`

// const validateTime = (time) =>
//   time === '' ||
//   new Date(time).getTime() <= Date.now() ||
//   'date must not exceed preset'

const addZero = (date) => (date.toString().length === 1 ? `0${date}` : date)
const formatData = (time) => time && new Date(time).getTime() / 1000
const getTime = (time) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(
    date.getDate()
  )}`
}

export default function DomainSelector({ domain, useGetData }) {
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    register,
    clearErrors,
    errors,
  } = useForm({
    defaultValues: {
      start: getTime(domain[0]),
      end: getTime(domain[1]),
    },
  })
  const inputCtx = { setValue, errors, clearErrors }

  const validateStart = (start) => {
    const { end } = getValues()
    if (end !== '' && new Date(end).getTime() <= new Date(start).getTime())
      return 'start time must be less than end time'

    // return validateTime(start)
  }

  return (
    <Request
      title="select data domain"
      buttonText={<GoGear size="20" />}
      useRequest={useGetData}
      render={([status, request]) => {
        const onSubmit = (data) => {
          request({
            start: formatData(data.start),
            end: formatData(data.end),
          })
        }

        return (
          <div className="space-children-y">
            <p>unselected dates default to get the min/max of the data set</p>

            <StyledForm
              onSubmit={handleSubmit(onSubmit)}
              className="space-children-y"
            >
              <SettingInput
                ref={register({ validate: validateStart })}
                name="start"
                label="start time"
                {...inputCtx}
              />
              <SettingInput
                ref={register}
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
        )
      }}
    />
  )
}
