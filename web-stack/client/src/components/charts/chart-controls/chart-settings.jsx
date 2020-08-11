import React from 'react'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

const StyledForm = styled.form`
  /* max-width: 16rem; */
  margin: auto;
`

export default ({ useGetData, intervalState: [interval, setInterval] }) => {
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: interval,
  })

  const [status, getData] = useGetData()

  const onSubmit = handleSubmit(async (data) => {
    setInterval(data)
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
      // setError(<p className="error">'values must not exceed the present'</p>)
      return
    }

    if (start >= end) {
      // setError(<p className="error">'end must come after start'</p>)
      return
    }

    try {
      await getData()
    } catch (error) {
      console.error(error)
    }
  })

  const clearStart = (e) => {
    e.preventDefault()
    setValue('start', '')
    setInterval((times) => ({ ...times, start: '' }))
  }
  const clearEnd = (e) => {
    e.preventDefault()
    setValue('end', '')
    setInterval((times) => ({ ...times, end: '' }))
  }

  const resetValues = () => {
    reset()
    setInterval({})
  }

  return (
    <div className="space-children-y">
      <p>unselected dates default to min max of the data set</p>
      <StyledForm onSubmit={onSubmit} className="space-children-y">
        <div>
          <label className="label space-children-x-xxs">
            start:
            <br />
            <input className="input" type="date" ref={register} name="start" />
            <br />
          </label>
          <button className="button-text text-blue" onClick={clearStart}>
            clear
          </button>
        </div>
        <div>
          <label className="label space-children-x-xxs">
            end:
            <br />
            <input className="input" type="date" ref={register} name="end" />
            <br />
          </label>
          <button className="button-text text-blue" onClick={clearEnd}>
            clear
          </button>
        </div>
        {status}
        <button className="button">submit</button>
      </StyledForm>
      <div className="space-children-x">
        <button className="button-text text-blue" onClick={resetValues}>
          clear all
        </button>
      </div>
    </div>
  )
}
