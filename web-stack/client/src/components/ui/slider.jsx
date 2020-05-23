import React, { useState } from 'react'
import styled from '@emotion/styled'

const Root = styled.div`
  input {
    width: 100%;
    height: 3px;
    background: var(--button-background);
    -webkit-appearance: none;

    ::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      background: var(--font-color);
      border-radius: 100%;
      -webkit-appearance: none;
    }
  }
`

export default () => {
  const [value, setValue] = useState(50)
  return (
    <Root className='button'>
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
