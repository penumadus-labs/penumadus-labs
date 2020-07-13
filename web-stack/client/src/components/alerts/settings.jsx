import React from 'react'
import styled from '@emotion/styled'
import Alert from './alert'

const FormWrapper = styled.div`
  p {
    text-align: initial;
  }
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`

export default ({ ...bind }) => {
  return (
    <Alert {...bind}>
      <FormWrapper>
        <StyledForm className="space-children-y">
          <p>time interval:</p>
          <label className="label space-children-x-xxs">
            start:
            <br />
            <input className="input-inline" type="date" />
            <input className="input-box" />
          </label>
          <label className="label space-children-x-xxs">
            end:
            <br />
            <input className="input-inline" type="date" />
            <input className="input-box" />
          </label>
        </StyledForm>
      </FormWrapper>
    </Alert>
  )
}

export { useAlert } from './alert'
