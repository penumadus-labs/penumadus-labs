import styled from '@emotion/styled'
import React from 'react'
import { formatHoursMinutes, parseDate } from '../datetime'

const StyledSelect = styled.select`
  height: 32px;
  border-radius: var(--radius);
  padding: 0 var(--xs);
`

export default ({ events, ...props }) => (
  <StyledSelect className="shadow-button clickable-box" {...props}>
    {events.map((time, i) => (
      <option key={i} value={i}>
        {parseDate(time)} - {formatHoursMinutes(time)}
      </option>
    ))}
  </StyledSelect>
)
