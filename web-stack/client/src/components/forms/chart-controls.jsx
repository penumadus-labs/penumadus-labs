import React from 'react'
import Slider from '../inputs/slider'
import Box from '../inputs/box'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'

const StyledFrom = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default () => {
  useForm()

  const onReset = (e) => {
    e.preventDefault()
  }
  return (
    <>
      <StyledFrom className="card space-children-x bar">
        <Box before="start time:" />
        <Box before="stop time:" />
        <Slider />
        <button className="button" onClick={onReset}>
          Apply
        </button>
        <button className="button" onClick={onReset}>
          Reset
        </button>
      </StyledFrom>
    </>
  )
}
