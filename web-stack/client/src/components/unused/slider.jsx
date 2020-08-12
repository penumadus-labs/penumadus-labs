// unused
import React, { useState } from 'react'
import styled from '@emotion/styled'
import Box from './box'

const Slider = styled.div`
  flex-grow: 1;
  input {
    width: 100%;
    height: 3px;
    margin: var(--md) 0;
    background: var(--button-background);
    cursor: pointer;
    -webkit-appearance: none;

    :focus {
      outline: none;
      ::-webkit-slider-thumb {
        box-shadow: var(--select);
        transition: box-shadow 0.2s;
      }
    }

    &::-webkit-slider-thumb {
      width: var(--md);

      height: var(--md);
      background: var(--font);
      border-radius: 100%;
      -webkit-appearance: none;
    }
  }
`

export default () => {
  const [value, setValue] = useState(1000)

  const onChange = ({ target }) => setValue(target.value)
  return (
    <>
      <Box before="slice:" value={value} onChange={onChange} />
      <Slider>
        <input
          type="range"
          min="0"
          max="1000"
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
      </Slider>
    </>
  )
}
