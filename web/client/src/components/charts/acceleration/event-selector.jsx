import styled from '@emotion/styled'
import React from 'react'
import { formatHoursMinutes, parseDate } from '../utils/datetime'
// import Select from '../../select'

const StyledSelect = styled.select`
  height: 34px;
  appearance: none;
`

export default ({ eventList, useGetAccelerationEvent, ...props }) => {
  const [, getEvent, { loading }] = useGetAccelerationEvent()
  // const options = eventList.map(
  //   (time, i) => `${parseDate(time)} - ${formatHoursMinutes(time)}`
  // )
  // const [selected, setSelected] = useState(options[0])

  // const handleChange = async (value) => {
  //   const indexOf = options.indexOf(value)
  //   await getEvent(indexOf)
  //   setSelected()
  // }

  // return <Select selected={selected} options={options} />

  const handleChange = ({ target }) => {
    getEvent(target.value)
  }

  return (
    <StyledSelect
      className="shadow-button button"
      disabled={loading}
      onChange={handleChange}
      {...props}
    >
      {eventList.map((time, i) => (
        <option key={i} value={i}>
          {parseDate(time)} - {formatHoursMinutes(time)}
        </option>
      ))}
    </StyledSelect>
  )
}
