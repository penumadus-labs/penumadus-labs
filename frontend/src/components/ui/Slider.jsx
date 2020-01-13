import React, { useState } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  input {
    ${({
      theme: {
        mixins: { clickable, style },
      },
    }) => clickable + style}
    width: 100%;
    height: 3px;
    background: ${({ theme }) => theme.color.icon};
    -webkit-appearance: none;

    ::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      background: ${({ theme }) => theme.color.font};
      border-radius: 100%;
      -webkit-appearance: none;
    }
  }
`

const Slider = () => {
  const [value, setValue] = useState(50)
  return (
    <Root>
      <label htmlFor='slider'>slider: {value}</label>
      <br />
      <input
        type='range'
        min='0'
        max='100'
        value={value}
        name='slider'
        onChange={({ target }) => setValue(target.value)}
      ></input>
    </Root>
  )
}

export default Slider
