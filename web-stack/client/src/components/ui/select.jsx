import React, { useState } from 'react'
import styled from '@emotion/styled'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'

const Root = styled.div`
  position: relative;
  height: 32px;
`

const Dropdown = styled.div`
  position: absolute;
  z-index: var(--layer1);
  min-width: 100px;
  overflow: hidden;
  border-radius: var(--radius);
  outline: none;
  user-select: none;

  .selected,
  option {
    padding: var(--sm);
    background: var(--button-background);
  }
`

const Selected = styled.div`
  display: flex;
  align-items: center;

  p {
    flex: 1 1 auto;
  }
`

export default ({ selected, options, handleSelect }) => {
  // const [value, setValue] = useState(list[0])
  const [toggled, setToggled] = useState(false)

  const handleToggle = () => {
    setToggled(!toggled)
  }

  const handleKeyDown = () => {}

  return (
    <Root>
      <Dropdown
        className='shadow'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role='listbox'
        tabIndex={0}
      >
        <Selected className='selected clickable'>
          <p>{selected}</p>
          <DownArrow size={18} />
        </Selected>
        {toggled && (
          <div>
            {options
              .filter((item) => item !== selected)
              .map((item) => (
                <option
                  className='clickable'
                  key={item}
                  value={item}
                  onClick={handleSelect}
                  onKeyDown={handleKeyDown}
                >
                  {item}
                </option>
              ))}
          </div>
        )}
      </Dropdown>
    </Root>
  )
}
