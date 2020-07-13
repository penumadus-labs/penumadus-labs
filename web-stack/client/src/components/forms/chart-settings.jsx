import React from 'react'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import Status, { useStatus } from './status'
import useDatabase from '../../context/database/context'

const StyledForm = styled.form`
  /* max-width: 16rem; */
  margin: auto;
`

export default ({ ...bind }) => {
  const { register, handleSubmit } = useForm()

  const [, { getStandardData }] = useDatabase()

  const [{ setLoading, setError, setSuccess }, status] = useStatus()

  const onSubmit = handleSubmit(async (data) => {
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

  return (
    <>
      <StyledForm onSubmit={onSubmit} className="space-children-y">
        <p>time interval:</p>
        <label className="label space-children-x-xxs">
          start:
          <input className="input" type="date" ref={register} name="start" />
        </label>
        <label className="label space-children-x-xxs">
          end:
          <input className="input" type="date" ref={register} name="end" />
        </label>
        <Status {...status} />
        <button className="button">submit</button>
      </StyledForm>
    </>
  )
}
