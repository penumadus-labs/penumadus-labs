import React from 'react'
// import Slider from '../../components/inputs/slider'
import Box from '../../components/inputs/box'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'

const StyledFrom = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default () => {
  useForm()

  const onReset = (e) => {
    e.preventDefault()
  }
  return (
    <>
      <StyledFrom className="space-children-x">
        <Box before="start time:" />
        <Box before="stop time:" />
        <div></div>
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
