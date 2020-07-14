import React from 'react'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import Status, { useStatus } from './status'
import useDatabase from '../../context/database/context'

const StyledForm = styled.form`
  /* max-width: 16rem; */
  margin: auto;
`

const StyledText = styled.p`
  font-size: var(--md);
  text-align: center;
`

export default ({ times, setTimes }) => {
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: times,
  })

  const [, { getStandardData }] = useDatabase()

  const [{ setLoading, setError, setSuccess }, status] = useStatus()

  const onSubmit = handleSubmit(async (data) => {
    setTimes({
      start: data.start,
      end: data.end,
    })
    const now = new Date(Date.now()).getTime() / 1000
    let start = new Date(data.start).getTime() / 1000
    let end = new Date(data.end).getTime() / 1000

    if (isNaN(start)) {
      start = undefined
    }

    if (isNaN(end)) {
      end = undefined
    }

    if (start > now || end > now) {
      setError('values must not exceed the present')
      return
    }

    if (start >= end) {
      setError('end must come after start')
      return
    }

    try {
      setLoading()
      await getStandardData({ id: 'unit_3', start, end })
      setSuccess()
    } catch (error) {
      console.error(error)
    }
  })

  const clearStart = () => {
    setValue('start', '')
    setTimes((times) => ({ ...times, start: '' }))
  }
  const clearEnd = () => {
    setValue('end', '')
    setTimes((times) => ({ ...times, end: '' }))
  }

  const resetValues = () => {
    reset()
    setTimes({})
  }

  return (
    <div className="space-children-y">
      <StyledText>select time interval</StyledText>
      <p>unselected dates default to min max of the data set</p>
      <StyledForm onSubmit={onSubmit} className="space-children-y">
        <div>
          <label className="label space-children-x-xxs">
            start:
            <br />
            <input className="input" type="date" ref={register} name="start" />
          </label>
        </div>
        <div>
          <label className="label space-children-x-xxs">
            end:
            <br />
            <input className="input" type="date" ref={register} name="end" />
          </label>
        </div>
        <Status {...status} />
        <button className="button">submit</button>
      </StyledForm>
      <div className="space-children-x">
        <button className="button-text text-blue" onClick={clearStart}>
          clear start
        </button>
        <button className="button-text text-blue" onClick={clearEnd}>
          clear end
        </button>
        <button className="button-text text-blue" onClick={resetValues}>
          reset
        </button>
      </div>
    </div>
  )
}
