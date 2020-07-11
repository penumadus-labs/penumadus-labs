import React from 'react'
import styled from '@emotion/styled'
import Alert from './alert'

const FormWrapper = styled.div`
  p {
    text-align: initial;
  }
`

const StyledForm = styled.form`
  display: inline-flex;
  flex-direction: column;
`

export default ({ ...bind }) => {
  return (
    <Alert {...bind}>
      <FormWrapper>
        <StyledForm className="space-children-y">
          <p>time interval:</p>
          <label className="label">
            start:
            <br />
            <input className="input-inline" type="date" />
            <input className="input-box" />
          </label>
          <label className="label">
            end:
            <br />
            <input className="input-inline" type="date" />
            <input className="input-box" />
          </label>
          <label>
            present:
            <input type="checkbox" />
          </label>
        </StyledForm>
      </FormWrapper>
    </Alert>
  )
}

export { useAlert } from './alert'
